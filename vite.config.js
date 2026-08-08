import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Direct Vite CSS compilation
  ],
  base: 'https://github.com/Urshivam-ui/Postman_Lite.git',
});
