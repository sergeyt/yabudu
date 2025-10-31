async function http(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(
      (await res.json().catch(() => ({})))?.error || res.statusText,
    );
  }
  return res.json();
}

export const api = {
  places: {
    list: () => http("/api/places"),
    get: (id: string) => http(`/api/places/${id}`),
    create: (body: any) =>
      http("/api/places", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: any) =>
      http(`/api/places/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    addAdmin: (placeId: string, userEmail: string) =>
      http(`/api/places/${placeId}/admins`, {
        method: "POST",
        body: JSON.stringify({ userEmail }),
      }),
    events: (placeId: string) => http(`/api/places/${placeId}/events`),
  },
  events: {
    create: (body: any) =>
      http("/api/events", { method: "POST", body: JSON.stringify(body) }),
    participants: (id: string) => http(`/api/events/${id}/participants`),
    register: (id: string) =>
      http(`/api/events/${id}/register`, { method: "POST" }),
    unregister: (id: string) =>
      http(`/api/events/${id}/register`, { method: "DELETE" }),
  },
};
