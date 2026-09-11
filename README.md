# Wuttichai Sukantho — Portfolio

A bilingual React and TypeScript portfolio combining the interactive `wuttichai_web`
application with the `WuttichaiSukantho` GitHub profile, portrait, and engineering artwork.

## Develop

```bash
bun install --frozen-lockfile
bun run dev
```

Open the development server at `/wuttichai.github.io/`.

```bash
bun run typecheck
bun run lint:check
bun run test
bun run build
bun run check:pages
bun run start
```

The production preview runs at `http://127.0.0.1:4173/wuttichai.github.io/`.
TanStack Start prerenders the page; GitHub Pages serves `dist/client` without a server runtime.

## Sources

See [SOURCES.md](SOURCES.md) for the live-site comparison and retained differences.

- `src/` and the original static assets come from `wuttichai_web`.
- [PROFILE.md](PROFILE.md) preserves the profile README, including ASCII and Mermaid diagrams.
- `public/profile/` contains the original full-body portrait and engineering SVGs.
- Both career histories are retained with source labels. ADot, Stream South, and the 2024
  M Biz entry differ between sources; they are not silently merged. The profile summary
  also preserves the README's degree, dates, and grade.

## GitHub Pages

The repository belongs to `WuttichaiSukantho`, so its project-site URL is
`https://wuttichaisukantho.github.io/wuttichai.github.io/`.
The Vite base, router base path, public asset paths, and canonical metadata use this location.

The workflow validates `dev`, `main`, and pull requests. Only `main` deploys.
To publish, select **Settings → Pages → Source → GitHub Actions**, then merge the reviewed
changes into `main`. See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

No Firebase credentials are needed. Keep secrets, `node_modules`, and build output out of Git.

## Mermaid

[Architecture](docs/ARCHITECTURE.md) contains the Mermaid diagram.
Edit `docs/architecture.json`; the exported source is `public/profile/architecture.mmd`.
The site displays a static SVG companion illustrating the same connections, with no
client-side Mermaid dependency. JSON Schema and the Mermaid skill's static lint validate
the source; the SVG companion is not evidence of native Mermaid renderer acceptance.
The original profile Mermaid diagrams and ASCII remain in `PROFILE.md`.
