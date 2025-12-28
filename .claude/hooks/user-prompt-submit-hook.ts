const input = await Bun.stdin.json()
const { cwd, prompt } = input;

// Create dynamic filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `.claude/logs/prompt-${timestamp}.json`;

await Bun.write(
  filename,
  JSON.stringify({ prompt, cwd }, null, 2)
);

// Handle :check-log suffix
if (prompt.endsWith(":check-log")) {
  const context = prompt.replace(/:check-log$/, "").trim();
  if (context) {
    console.log(`Read /home/mario/coding/financial-app/logs/yarn-dev.log and then: ${context}`);
  } else {
    console.log(`Read and analyze the development server logs at /home/mario/coding/financial-app/logs/yarn-dev.log to understand what's currently happening in the terminal.`);
  }
}
