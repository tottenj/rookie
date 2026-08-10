const response = http.post('http://127.0.0.1:3100/reset');

if (!response.ok) {
  throw new Error(`Failed to reset E2E environment: ${response.status}`);
}
