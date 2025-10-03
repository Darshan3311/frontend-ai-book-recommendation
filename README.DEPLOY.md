Render deployment notes

- Node.js version: set by `.nvmrc` to 22.16.0 to match the build environment.
- Build command (Render): `npm install; npm run build`
- Publish directory: `dist`

To deploy on Render (static site):
1. Create a new Static Site service on Render and connect your repository branch (main).
2. Use the build command: `npm install; npm run build` and the publish directory `dist`.
3. Optionally provide the `render.yaml` at repo root to configure the service automatically.

Notes:
- `vite` build output is placed in `dist`. The `tsc` step runs before `vite build` (see `build` script in `package.json`).
- If you need to pin Node.js version in Render, set it to `22.16.0` or use the `.nvmrc` file.
