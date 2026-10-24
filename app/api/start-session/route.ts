import { agent, avatar } from "@/app/config";

// Starts a hosted Simli agent session on the server, so the API key never reaches the browser.
// Simli runs the whole conversation (listening, thinking, speaking) and returns a Daily room to join.
export async function POST() {
  const apiKey = process.env.SIMLI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "SIMLI_API_KEY is missing. Add it to .env.local (see .env.example) and restart." }, { status: 500 });
  }

  const res = await fetch("https://api.simli.ai/auto/start/configurable", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-simli-api-key": apiKey },
    body: JSON.stringify({
      faceId: avatar.faceId,
      systemPrompt: agent.systemPrompt,
      firstMessage: agent.firstMessage,
      language: agent.language,
      llmConfig: { provider: "OpenAI", model: agent.model },
      // gpt-live-1 speaks with its own voice, given as the voiceId; the TTS settings go unused.
      ttsProvider: "Cartesia",
      voiceId: agent.voice,
      maxSessionLength: avatar.maxSessionSeconds,
      maxIdleTime: 120,
      streaming_width: avatar.width,
      streaming_height: avatar.height,
      ...(avatar.introAnimation && {
        introAnimation: avatar.introAnimation,
        triggerable_animations_preloaded: [avatar.introAnimation],
      }),
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.roomUrl) {
    return Response.json({ error: `Simli didn't start a session (${res.status}): ${JSON.stringify(data)}` }, { status: 502 });
  }
  data.warnings?.forEach((w: string) => console.warn("Simli:", w));
  return Response.json({ roomUrl: data.roomUrl });
}
