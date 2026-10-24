"use client";

import Daily, { type DailyCall, type DailyParticipant } from "@daily-co/daily-js";
import { useEffect, useRef, useState } from "react";
import AvatarStage, { type Status } from "./AvatarStage";

// The agent runs on Simli's servers and joins a Daily room. We join the same room:
// our microphone goes in, the avatar's video and voice come out.
export default function AgentAvatar({ name }: { name: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const call = useRef<DailyCall | null>(null);
  const run = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function stop() {
    run.current++;
    const c = call.current;
    call.current = null;
    c?.leave().finally(() => c.destroy());
    for (const el of [videoRef.current, audioRef.current]) if (el) el.srcObject = null;
  }

  useEffect(() => stop, []);

  // Show the avatar's tracks as soon as they arrive (or change).
  function showTracks(p: DailyParticipant) {
    if (p.local) return;
    const { video, audio } = p.tracks;
    if (video.persistentTrack && videoRef.current && videoRef.current.srcObject === null) {
      videoRef.current.srcObject = new MediaStream([video.persistentTrack]);
      setStatus("live");
    }
    if (audio.persistentTrack && audioRef.current && audioRef.current.srcObject === null) {
      audioRef.current.srcObject = new MediaStream([audio.persistentTrack]);
    }
  }

  async function start() {
    const id = ++run.current;
    const cancelled = () => id !== run.current;
    setError("");
    setStatus("connecting");
    try {
      const res = await fetch("/api/start-session", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      if (cancelled()) return;

      // Daily allows one call object per page.
      await Daily.getCallInstance()?.destroy();
      const c = Daily.createCallObject({ videoSource: false, audioSource: true });
      call.current = c;
      c.on("participant-joined", (e) => showTracks(e.participant));
      c.on("participant-updated", (e) => showTracks(e.participant));
      c.on("track-started", (e) => e.participant && showTracks(e.participant));
      c.on("participant-left", (e) => {
        if (!e.participant.local && !cancelled()) { stop(); setStatus("idle"); } // the session ended
      });
      c.on("error", (e) => {
        if (cancelled()) return;
        stop();
        setStatus("error");
        setError(`The call failed: ${e.errorMsg}`);
      });
      c.on("camera-error", () => {
        if (cancelled()) return;
        stop();
        setStatus("error");
        setError("The browser blocked the microphone. Allow it for this page and try again.");
      });
      await c.join({ url: body.roomUrl });
      if (cancelled()) return;
      Object.values(c.participants()).forEach(showTracks);
    } catch (e) {
      if (cancelled()) return;
      stop();
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <AvatarStage
      name={name}
      status={status}
      error={error}
      caption=""
      videoRef={videoRef}
      audioRef={audioRef}
      onStart={start}
      onStop={() => { stop(); setStatus("idle"); }}
    />
  );
}
