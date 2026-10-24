# Create Simli Agent

A complete real-time video agent with only a Simli API key. Simli hosts the whole conversation, with listening, thinking (GPT-Live) and speaking, and streams a lip-synced Trinity-2 avatar into your page.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimliai%2Fcreate-simli-agent&env=SIMLI_API_KEY&envDescription=Your%20Simli%20API%20key&envLink=https%3A%2F%2Fgithub.com%2Fsimliai%2Fcreate-simli-agent%23setup&project-name=simli-agent)

## Setup

You need Node.js 20 or newer and a [Simli API key](https://app.simli.com) (free plan included).

```bash
git clone https://github.com/simliai/create-simli-agent
cd create-simli-agent
npm install
cp .env.example .env.local   # then paste in your key
npm run dev
```

Open http://localhost:3000, press **Start conversation** and allow the microphone.

## Make it yours

Everything is in [`app/config.ts`](app/config.ts):

- **Face:** any Trinity-2 face ID. Pick a [preset](https://docs.simli.com/api-reference/preset-faces) or [make your own from a photo](https://app.simli.com).
- **Video size:** 16:9 by default; 1:1 and 9:16 work too.
- **Intro animation:** the avatar waves as the session opens. Set it to `null` to turn it off.
- **Voice, greeting and prompt.**

## How it works

1. The browser asks `app/api/start-session` to start a session. That route calls Simli with your API key, which never leaves the server.
2. Simli starts the agent and returns a room to join.
3. The browser joins it with [Daily](https://www.daily.co) ([`components/AgentAvatar.tsx`](components/AgentAvatar.tsx)): your microphone goes in, the avatar's video and voice come out.

Want your own LLM, voice or agent framework instead? See the [other starters](https://docs.simli.com/api-reference/samples/all-samples).

## Before you go to production

The session route is open to anyone who can reach your site, so each visit uses your Simli minutes. Put it behind your own sign-in or rate limiting. `maxSessionSeconds` in `app/config.ts` caps each session.

## More

- [Simli docs](https://docs.simli.com)
- Questions? Ask on [Discord](https://discord.gg/yQx49zNF4d).
