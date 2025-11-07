import { isDefined } from "@/lib/util";

async function http(
  input: RequestInfo,
  init?: Omit<RequestInit, "body"> & { body?: any },
) {
  const { body, ...initExtra } = init || {};
  const res = await fetch(input, {
    ...initExtra,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    ...(isDefined(body) && { body: JSON.stringify(body) }),
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
    create: (body: any) => http("/api/places", { method: "POST", body }),
    update: (id: string, body: any) =>
      http(`/api/places/${id}`, {
        method: "PATCH",
        body,
      }),
    addAdmin: (placeId: string, userEmail: string) =>
      http(`/api/places/${placeId}/admins`, {
        method: "POST",
        body: { userEmail },
      }),
    events: (placeId: string) => http(`/api/places/${placeId}/events`),
    action: (placeId: string, body: any) =>
      http(`/api/places/${placeId}/action`, {
        method: "POST",
        body,
      }),
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
