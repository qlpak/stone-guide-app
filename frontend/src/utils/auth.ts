export function getLoginUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_REDIRECT_URI}/callback`;

  const url = new URL(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "openid");

  return url.toString();
}
