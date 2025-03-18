// import { create } from "zustand";
// import axios from "axios";
// import axiosInstance from "@/dbUtils/axios";

// interface User {
//   userId: number;
//   role: number;
//   fullName: string;
//   email: string;
//   phone: string;
//   address: string;
//   status: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   error: string | null;
//   login: (values: {
//     accountName: string;
//     password: string;
//   }) => Promise<{ isSuccess: boolean; message: string | null; role: number }>;
//   logout: () => void;
//   setUser: (user: User) => void;
//   setToken: (token: string) => void;
// }

// const useAuthStore = create<AuthState>((set) => {
//   const storedUser = localStorage.getItem("user");
//   const storedToken = localStorage.getItem("token");

//   return {
//     user: storedUser ? JSON.parse(storedUser) : null,
//     token: storedToken || null,
//     error: null,

//     login: async (values) => {
//       try {
//         const response = await axiosInstance.post("controller/login", values);

//         const data = response.data;
//         if (data.isSuccess && data.data?.token) {
//           const user = data.data.loginResModel;

//           localStorage.setItem("user", JSON.stringify(user));
//           localStorage.setItem("token", data.data.token);

//           set({ user, token: data.data.token, error: null });

//           return { isSuccess: true, message: data.message, role: user.role };
//         } else {
//           set({ error: "Login failed" });
//           return { isSuccess: false, message: "Login failed", role: 0 };
//         }
//       } catch (error) {
//         const errorMessage =
//           axios.isAxiosError(error) && error.response?.data?.message
//             ? error.response.data.message
//             : (error as Error).message;
//         set({ error: errorMessage });
//         return { isSuccess: false, message: errorMessage, role: 0 };
//       }
//     },

//     logout: () => {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       set({ user: null, token: null, error: null });
//     },

//     setUser: (user) => set({ user }),
//     setToken: (token) => set({ token }),
//   };
// });

// export default useAuthStore;
import { create } from "zustand";
import axios from "axios";
import axiosInstance from "@/dbUtils/axios";

interface User {
  userId: number;
  role: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  isSuccess: boolean;
  message: string | null;
  data: {
    loginResModel: User;
    token: string;
  } | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  login: (values: { username: string; password: string }) => Promise<{
    success: boolean;
    message: string | null;
    role: number;
    data: LoginResponse["data"];
  }>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    error: null,

    login: async (values) => {
      try {
        const response = await axiosInstance.post<LoginResponse>(
          "controller/login",
          values
        );
        const data = response.data;

        if (data.isSuccess && data.data?.token) {
          const user = data.data.loginResModel;

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", data.data.token);

          set({ user, token: data.data.token, error: null });

          return {
            success: true,
            message: data.message,
            role: user.role,
            data: data.data,
          };
        } else {
          set({ error: "Login failed" });
          return {
            success: false,
            message: "Login failed",
            role: 0,
            data: null,
          };
        }
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : (error as Error).message;
        set({ error: errorMessage });
        return { success: false, message: errorMessage, role: 0, data: null };
      }
    },

    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({ user: null, token: null, error: null });
    },

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
  };
});

export default useAuthStore;
