import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "./useAuthRedirect";
import { decodeToken } from "./token";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("./token", () => ({
  decodeToken: jest.fn(),
}));

describe("useAuthRedirect", () => {
  const mockReplace = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockDecodeToken = decodeToken as jest.MockedFunction<
    typeof decodeToken
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    console.error = jest.fn();
  });

  it("redirects to home when no token exists", async () => {
    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("redirects to home when token is invalid", async () => {
    localStorage.setItem("token", "invalid.token");
    mockDecodeToken.mockReturnValue(null);

    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when user has required role", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockReturnValue({
      preferred_username: "adminuser",
      realm_access: {
        roles: ["admin", "user"],
      },
      exp: 1234567890,
    });

    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it("redirects when user does not have required role", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockReturnValue({
      preferred_username: "user",
      realm_access: {
        roles: ["user"],
      },
      exp: 1234567890,
    });

    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("allows access when user has one of multiple allowed roles", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockReturnValue({
      preferred_username: "user",
      realm_access: {
        roles: ["user"],
      },
      exp: 1234567890,
    });

    renderHook(() => useAuthRedirect(["admin", "user"]));

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it("redirects when decoding throws error", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockImplementation(() => {
      throw new Error("Decode error");
    });

    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to decode token:",
        expect.any(Error)
      );
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("handles missing realm_access in decoded token", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockReturnValue({
      preferred_username: "user",
      exp: 1234567890,
      realm_access: undefined,
    } as unknown as ReturnType<typeof mockDecodeToken>);

    renderHook(() => useAuthRedirect(["admin"]));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("re-checks auth when allowedRoles change", async () => {
    localStorage.setItem("token", "valid.token");
    mockDecodeToken.mockReturnValue({
      preferred_username: "user",
      realm_access: {
        roles: ["user"],
      },
      exp: 1234567890,
    });

    const { rerender } = renderHook(({ roles }) => useAuthRedirect(roles), {
      initialProps: { roles: ["user"] },
    });

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });

    // Change allowed roles to admin only
    mockReplace.mockClear();
    rerender({ roles: ["admin"] });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
