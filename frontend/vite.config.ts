import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { execSync } from "child_process";

// Get git commit hash
let gitCommit = "unknown";
try {
  gitCommit = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  // Git not available or not in a git repo
  console.warn("Could not determine git commit hash");
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  define: {
    __GIT_COMMIT__: JSON.stringify(gitCommit),
  },
  server: {
    port: 3000,
    strictPort: true, // fail instead of silently picking another port if 3000 is taken
    open: true, // open the browser on server start
  },
});
