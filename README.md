# Typewriter

A typing speed test app with real-time WPM tracking, accuracy measurement, and an AI-powered coach.

**[Live Demo](https://typewriter-test-app.vercel.app)**

## Features

- **Real-time stats** - live WPM, accuracy, and progress bar as you type
- **Per-character feedback** - correct characters highlighted green, incorrect ones red, with a blinking cursor
- **5 built-in passages** - cycle through different texts with the "Next" button
- **End screen** - final stats grid (WPM, accuracy, time, correct/total) and a WPM-over-time area chart
- **AI Coach** - after each session, Claude Haiku analyzes your most-missed keys and streams personalized improvement tips
- **Dark/light mode** - follows system preference automatically

## Device Support

Designed for devices with a physical keyboard. Opening the app on a touchscreen-only device (phone, tablet) shows a message asking the user to switch to a keyboard device instead.

## Tech Stack

- [Next.js](https://nextjs.org) 16.1.6 · React 19.2.3 · TypeScript 5
- [Tailwind CSS](https://tailwindcss.com) v4
- [Recharts](https://recharts.org) 3 - WPM history chart
- [Vercel AI SDK](https://sdk.vercel.ai) v6 + Claude Haiku - AI coaching

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> You can also use `npm run dev`, `yarn dev`, or `bun dev`.

### Environment Variables

Create a `.env.local` file at the project root with your Anthropic API key to enable the AI Coach:

```
ANTHROPIC_API_KEY=your_key_here
```

Without this key the app works normally - the AI Coach panel simply won't appear.
