import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "./token";

export function useAuthRedirect(allowedRoles: string[]) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      //   console.warn("No token, redirecting");
      router.replace("/");
      return;
    }

    try {
      const decoded = decodeToken(token);
      const roles = decoded?.realm_access?.roles || [];

      const hasAccess = allowedRoles.some((role) => roles.includes(role));

      if (!hasAccess) {
        // console.warn("Access denied, redirecting");
        router.replace("/");
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      router.replace("/");
    }
  }, [allowedRoles, router]);
}
