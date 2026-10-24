import AgentAvatar from "@/components/AgentAvatar";
import { avatar } from "./config";

export default function Home() {
  return (
    <main>
      <header>
        <h1>Simli Agent</h1>
        <p>A complete video agent hosted by Simli, on Trinity-2. Only a Simli API key needed. Change the face, voice and prompt in <code>app/config.ts</code>.</p>
      </header>
      <AgentAvatar name={avatar.name} />
      <footer>
        <a href="https://docs.simli.com">Docs</a>
        <a href="https://app.simli.com">Create your own avatar</a>
        <a href="https://github.com/simliai/create-simli-agent">GitHub</a>
      </footer>
    </main>
  );
}
