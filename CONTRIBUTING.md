# Contributing to QUILD

Thanks for contributing to the open-source patent commons platform!

## Workflow

1. Fork the repo, branch off `main`:
   - `feat/<name>` · `fix/<name>` · `docs/<name>`
2. Install and verify:
   ```bash
   npm install
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
3. Open a Pull Request against `main`. CI runs **Lint & Build (Node 20 + 22)** and **Typecheck** — both must pass.
4. Keep PRs small and single-purpose. Include screenshots/GIFs for UI changes and note which of the 9 App-Router modules are touched (`dashboard`, `projects`, `validation`, `ip`, `marketplace`, `revenue`, `contributors`, `governance`, `royalties`).

## Conventions

- TypeScript strict, no `any` without justification. Tailwind v4 + `lucide-react` icons.
- Mock data lives in `src/lib` — don't wire real backends without discussing in an issue first.
- Update the Roadmap checkboxes in `README.md` when you complete a milestone.

## Issues

Report bugs with: route, steps to reproduce, expected vs actual, browser/Node version, screenshots.
