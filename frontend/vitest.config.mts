import { defineConfig } from "vitest/config.js";
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "happy-dom"
    }
})