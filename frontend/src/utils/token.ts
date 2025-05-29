import { jwtDecode } from "jwt-decode";

type KeycloakToken = {
  preferred_username: string;
  realm_access: {
    roles: string[];
  };
  exp: number;
};

export function decodeToken(token: string): KeycloakToken | null {
  try {
    return jwtDecode<KeycloakToken>(token);
  } catch {
    return null;
  }
}

export function getUserRole(): "admin" | "user" | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const roles = decoded.realm_access?.roles || [];
  if (roles.includes("admin")) return "admin";
  if (roles.includes("user")) return "user";
  return null;
}
