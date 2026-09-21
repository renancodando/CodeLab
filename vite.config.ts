import { defineConfig } from 'vite';
export default defineConfig({ server: { port: 5173, strictPort: true, watch: { ignored: ['**/server/**', '**/test-results/**', '**/playwright-report/**'] }, proxy: { '/api': 'http://127.0.0.1:5080' } }, build: { target: 'es2022' }, worker: { format: 'es' } });
