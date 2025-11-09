import crypto from "node:crypto";

const SECRET = process.env.TELEGRAM_LINK_SECRET ?? "dev-only-secret";

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) {
    s += "=";
  }
  return Buffer.from(s, "base64");
}

export function createLinkCode(placeId: string, ttlSeconds: number = 15 * 60) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = { placeId, exp };
  const p = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", SECRET).update(p).digest();
  return `${b64url(p)}.${b64url(sig)}`;
}

export function verifyLinkCode(
  code: string,
): { ok: true; placeId: string } | { ok: false; error: string } {
  const [p64, s64] = code.split(".");
  if (!p64 || !s64) {
    return { ok: false, error: "Malformed code" };
  }
  const payloadBuf = fromB64url(p64);
  const sigBuf = fromB64url(s64);
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payloadBuf)
    .digest();
  if (
    sigBuf.length !== expected.length ||
    !crypto.timingSafeEqual(sigBuf, expected)
  ) {
    return { ok: false, error: "Bad signature" };
  }
  const payload = JSON.parse(payloadBuf.toString("utf8")) as {
    placeId: string;
    exp: number;
  };
  if (!payload.placeId || !payload.exp) {
    return { ok: false, error: "Invalid payload" };
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return { ok: false, error: "Code expired" };
  }
  return { ok: true, placeId: payload.placeId };
}
