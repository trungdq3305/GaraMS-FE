"use client";

import { createContext, useEffect, type PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/app/login/hooks/useAuthStore";

type AuthGuardContextType = Record<string, unknown>;

const AuthGuardContext = createContext<AuthGuardContextType>({});

const publicPages = [
  "/",
  "/services",
  "/promotions",
  "/term_policy",
  "/signup",
  "/login",
];

type UserRole = "4" | "1" | "3" | "2";

const roleRedirects: Record<UserRole, string> = {
  4: "/dashboard",
  1: "/",
  3: "/appointments",
  2: "/appointments",
};

const restrictedPages: Record<UserRole, string[]> = {
  4: ["/dashboard", "/usermanagement"],
  2: ["/appointments"],
  1: [
    "/",
    "/appointment",
    "/customerappointment",
    "/invoice/fail",
    "/invoice/success",
    "/payment",
    "/profile",
    "/profile/[vehicleId]",
    "/promotions",
    "/promotions/[promotionId]",
    "/report",
    "/services",
    "/services/[serviceId]",
    "/term_policy",
    "/vehicle",
  ],
  3: [
    "/appointments",
    "/employeemanagement",
    "/inventorymanagement",
    "/promotionmanagement",
    "/reportmanagement",
    "/servicemanagement",
  ],
};

export function AuthGuardProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, token, setUser, setToken } = useAuthStore();

  useEffect(() => {
    if (!user || !token) {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
  }, [setUser, setToken, user, token, logout]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          message.warning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          logout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, [token, logout]);

  useEffect(() => {
    if (!user || !user.role) {
      if (!publicPages.includes(pathname)) {
        router.replace("/login");
      }
      return;
    }

    const userRole = user.role as unknown as UserRole;

    if (pathname === "/") {
      router.replace(roleRedirects[userRole] || "/home");
      return;
    }

    const isRestricted = restrictedPages[userRole]?.some((route) => {
      const dynamicRoutePattern = route
        .replace("[vehicleId]", "[0-9]+")
        .replace("[promotionId]", "[0-9]+")
        .replace("[serviceId]", "[0-9]+");

      const regex = new RegExp(`^${dynamicRoutePattern}$`);

      return regex.test(pathname);
    });

    if (!publicPages.includes(pathname) && !isRestricted) {
      router.replace("/forbidden");
    }
  }, [user, pathname, router]);

  useEffect(() => {
    console.log("Current Pathname:", pathname);
  }, [pathname]);

  return (
    <AuthGuardContext.Provider value={{}}>{children}</AuthGuardContext.Provider>
  );
}

export default AuthGuardContext;
