import { cookies } from "next/headers";
import { logger } from "./logger";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const raw = process.env.ADMIN_TOKEN || "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

function toBase64Url(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 * Contains role and expiration timestamp.
 */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("ADMIN_TOKEN is not configured on the server.");
  }

  const payload = {
    role: "admin",
    exp: Date.now() + SESSION_DURATION_MS,
    iat: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const payloadB64 = toBase64Url(payloadString);

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  const signatureB64 = toBase64Url(new Uint8Array(signatureBuffer));

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies the cryptographic signature and expiration of a session token.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }

  const secret = getSecret();
  if (!secret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getCryptoKey(secret);
    const signatureBytes = fromBase64Url(signatureB64);
    const dataBytes = new TextEncoder().encode(payloadB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as any,
      dataBytes
    );

    if (!isValid) {
      return false;
    }

    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || typeof payload.exp !== "number" || payload.exp <= Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Guard for Server Actions. Throws an error if the caller is not authenticated.
 */
export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const isValid = await verifySessionToken(sessionToken);
  if (!isValid) {
    logger.security("AUTH_UNAUTHORIZED_ACTION", "Blocked attempt to execute server action without valid session");
    throw new Error("Acceso no autorizado.");
  }
}

/**
 * Checks if current request has a valid admin session.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return await verifySessionToken(sessionToken);
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
