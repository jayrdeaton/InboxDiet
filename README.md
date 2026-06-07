# TrimBox

Scan your Gmail inbox and find every mailing list you're subscribed to.

TrimBox connects to Gmail with read-only metadata access, scans up to 10,000 messages for `List-Unsubscribe` headers, and surfaces every bulk sender, grouped, sorted, and with one-click unsubscribe links. No email content is ever read or stored.

## Features

- **Gmail metadata scan** — reads only `From` and `List-Unsubscribe` headers; email body content never leaves Google's servers
- **Real-time progress** — live SSE feed as messages are processed
- **Flexible grouping** — group results by sender domain or exact address
- **Unsubscribe links** — extracted directly from email headers, deduplicated, and ranked by recency
- **Scan options** — inbox only or inbox + archived, optional spam/trash, promotions filter, minimum email count threshold
- **CSV export** — download results as one row per sender or one row per unsubscribe link
- **Dark / light / system mode**

## Tech Stack

- [Nuxt 4](https://nuxt.com) + Vue 3
- [Tailwind CSS](https://tailwindcss.com)
- [Google APIs](https://www.npmjs.com/package/googleapis) — `gmail.metadata` scope
- Deployed on [Vercel](https://vercel.com)

## Development

**Prerequisites:** Node.js 20+, a Google Cloud project with the Gmail API enabled and an OAuth 2.0 client configured.

```bash
cp .env.example .env
# fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
npm install
npm run dev
```

The app runs at `http://localhost:3000`. The OAuth callback is `/api/auth/callback`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Lint |
| `npm run typecheck` | Type check |

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 client secret |

See `.env.example` for the full list.

## Privacy

TrimBox requests `https://www.googleapis.com/auth/gmail.metadata` — the narrowest Gmail scope available. It grants read access to message metadata and headers only. No email content, attachments, or personal data are stored on TrimBox servers. All scan results are processed in memory and discarded when you close the tab.

## License

MIT — [Jay Deaton](https://github.com/jayrdeaton)
