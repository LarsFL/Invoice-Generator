import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works on GitHub Pages project sites
// (served from /<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
