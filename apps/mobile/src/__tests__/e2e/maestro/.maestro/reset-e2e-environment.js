async function waitForControlServer() {
  const url = 'http://127.0.0.1:3100/health';

  console.log("QUERYING FOR HEALTH");

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Control server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`E2E control server is not ready at ${url}`);
}

async function resetE2eEnvironment() {
  console.log("WAITING FOR CONTROL SERVER");
  await waitForControlServer();
  

  const response = await fetch('http://127.0.0.1:3100/reset', {
    method: 'POST',
  });

  console.log(response);
  console.log(await response.text());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`E2E reset failed: ${response.status} ${errorText}`);
  }
}

resetE2eEnvironment().catch((error) => {
  console.error(error);
  process.exit(1);
});
