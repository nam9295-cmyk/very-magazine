## Very Magazine

Latest stack starter created on March 28, 2026:

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4.2.2
- App Router
- `src/` directory structure

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Structure

```text
src
├─ app
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  └─ common
└─ lib
```

## Notes

- Tailwind CSS v4 is configured through `postcss.config.mjs`.
- The `@/*` alias maps to `src/*`.
- App Router entry files live in `src/app`.
