/* global http */

function waitForControlServer() {
  const maxAttempts = 60;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = http.get('http://127.0.0.1:3100/health');
      if (response.ok) {
        return;
      }
    } catch (_error) {
      // control server still starting
    }
  }

  throw new Error('E2E control server is not ready at http://127.0.0.1:3100/health');
}

waitForControlServer();

const resetResponse = http.post('http://127.0.0.1:3100/reset', {
  body: JSON.stringify({}),
});
console.log('Reset status: ' + resetResponse.status);
console.log(resetResponse.body);

if (!resetResponse.ok) {
  throw new Error('E2E reset failed: ' + resetResponse.status + ' ' + resetResponse.body);
}
