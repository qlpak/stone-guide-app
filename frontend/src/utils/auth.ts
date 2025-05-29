function base64URLEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getLoginUrl(
  mode: "login" | "signup" = "login"
): Promise<string> {
  const base = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_REDIRECT_URI}/callback`;

  const codeVerifier = base64URLEncode(
    crypto.getRandomValues(new Uint8Array(32)).buffer
  );
  sessionStorage.setItem("pkce_verifier", codeVerifier);

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64URLEncode(digest);

  const baseUrl = `${base}/realms/${realm}/protocol/openid-connect/auth`;

  const loginParams = `response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  if (mode === "signup") {
    return `${base}/realms/${realm}/protocol/openid-connect/registrations?${loginParams}`;
  }

  return `${baseUrl}?${loginParams}`;
}
