export function generateBasicAuthToken() {
  const credentials = "admin:qwerty";
  const token = Buffer.from(credentials).toString("base64");
  return `Basic ${token}`;
}
