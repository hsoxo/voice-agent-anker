export async function getWebSettings(clientId: string) {
  const url = `/voice-api/web-app-settings/${clientId}`;
  const response = await fetch(url);
  return response.json();
}

export async function updateWebSettings(settings: any, clientId: string) {
  const url = `/voice-api/web-app-settings/${clientId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  return response.json();
}
