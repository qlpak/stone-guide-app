import { getLoginUrl } from "./auth";

describe("auth utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_KEYCLOAK_BASE_URL: "https://keycloak.example.com",
      NEXT_PUBLIC_KEYCLOAK_REALM: "test-realm",
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "test-client",
      NEXT_PUBLIC_REDIRECT_URI: "https://app.example.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getLoginUrl", () => {
    it("generates correct login URL with all parameters", () => {
      const url = getLoginUrl();
      const parsedUrl = new URL(url);

      expect(parsedUrl.origin).toBe("https://keycloak.example.com");
      expect(parsedUrl.pathname).toBe(
        "/realms/test-realm/protocol/openid-connect/auth"
      );
      expect(parsedUrl.searchParams.get("response_type")).toBe("code");
      expect(parsedUrl.searchParams.get("client_id")).toBe("test-client");
      expect(parsedUrl.searchParams.get("redirect_uri")).toBe(
        "https://app.example.com/callback"
      );
      expect(parsedUrl.searchParams.get("scope")).toBe("openid");
    });

    it("includes callback path in redirect URI", () => {
      const url = getLoginUrl();
      const parsedUrl = new URL(url);

      expect(parsedUrl.searchParams.get("redirect_uri")).toContain("/callback");
    });

    it("returns URL as string", () => {
      const url = getLoginUrl();

      expect(typeof url).toBe("string");
      expect(url).toMatch(/^https?:\/\//);
    });
  });
});
