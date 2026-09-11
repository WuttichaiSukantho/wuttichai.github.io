import { scan } from '@sonar/scan';

const eslint = Bun.spawn(
  ['bunx', 'eslint', 'src', '--format', 'json', '--output-file', 'eslint-report.json'],
  {
    stderr: 'inherit',
    stdout: 'inherit',
  },
);

const eslintExitCode = await eslint.exited;

if (eslintExitCode > 1) {
  throw new Error(`ESLint report generation failed with exit code ${eslintExitCode}`);
}

await scan({
  serverUrl: 'http://localhost:9000',
  options: {
    'sonar.qualitygate.wait': 'true',
  },
  ...(process.env.SONAR_TOKEN ? { token: process.env.SONAR_TOKEN } : {}),
});
