import { decodeToken, getUserRole } from "./token";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode");

describe("token utilities", () => {
  const mockJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("decodeToken", () => {
    it("decodes valid token successfully", () => {
      const mockDecodedToken = {
        preferred_username: "testuser",
        realm_access: {
          roles: ["admin", "user"],
        },
        exp: 1234567890,
      };

      mockJwtDecode.mockReturnValue(mockDecodedToken);

      const result = decodeToken("valid.jwt.token");

      expect(result).toEqual(mockDecodedToken);
      expect(mockJwtDecode).toHaveBeenCalledWith("valid.jwt.token");
    });

    it("returns null for invalid token", () => {
      mockJwtDecode.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = decodeToken("invalid.token");

      expect(result).toBeNull();
    });

    it("returns null when jwt-decode throws any error", () => {
      mockJwtDecode.mockImplementation(() => {
        throw new Error("Malformed JWT");
      });

      const result = decodeToken("malformed.jwt");

      expect(result).toBeNull();
    });
  });

  describe("getUserRole", () => {
    it("returns null when no token in localStorage", () => {
      const result = getUserRole();

      expect(result).toBeNull();
    });

    it("returns null when token cannot be decoded", () => {
      localStorage.setItem("token", "invalid.token");
      mockJwtDecode.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = getUserRole();

      expect(result).toBeNull();
    });

    it('returns "admin" when user has admin role', () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "adminuser",
        realm_access: {
          roles: ["admin", "user"],
        },
        exp: 1234567890,
      });

      const result = getUserRole();

      expect(result).toBe("admin");
    });

    it('returns "user" when user has user role but not admin', () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "regularuser",
        realm_access: {
          roles: ["user"],
        },
        exp: 1234567890,
      });

      const result = getUserRole();

      expect(result).toBe("user");
    });

    it("returns null when user has no recognized roles", () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "norolesuser",
        realm_access: {
          roles: ["unknown"],
        },
        exp: 1234567890,
      });

      const result = getUserRole();

      expect(result).toBeNull();
    });

    it("returns null when realm_access is missing", () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "user",
        exp: 1234567890,
        realm_access: undefined,
      } as unknown as ReturnType<typeof mockJwtDecode>);

      const result = getUserRole();

      expect(result).toBeNull();
    });

    it("returns null when roles array is empty", () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "user",
        realm_access: {
          roles: [],
        },
        exp: 1234567890,
      });

      const result = getUserRole();

      expect(result).toBeNull();
    });

    it("prioritizes admin role over user role", () => {
      localStorage.setItem("token", "valid.token");
      mockJwtDecode.mockReturnValue({
        preferred_username: "superuser",
        realm_access: {
          roles: ["user", "admin", "other"],
        },
        exp: 1234567890,
      });

      const result = getUserRole();

      expect(result).toBe("admin");
    });
  });
});
