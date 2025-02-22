import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { App } from "antd";
import axios, { AxiosError } from "axios";
import useAuthStore from "./useAuthStore";
import axiosInstance from "@/dbUtils/axios";

interface LoginResponse {
  isSuccess: boolean;
  code: number;
  data: {
    loginResModel: {
      userId: number;
      role: number;
      fullName: string;
      createdAt: string;
      updatedAt: string;
      email: string;
      phone: string;
      address: string;
      status: boolean;
    };
    token: string;
  };
  message: string | null;
}

interface LoginVariables {
  username: string;
  password: string;
}

const login = async ({ username, password }: LoginVariables) => {
  const response = await axiosInstance.post<LoginResponse>("controller/login", {
    username,
    password,
  });
  return response.data;
};

const useLogin = (
  options?: UseMutationOptions<LoginResponse, AxiosError, LoginVariables>
) => {
  const { message } = App.useApp();
  const { setUser, setToken } = useAuthStore();

  return useMutation<LoginResponse, AxiosError, LoginVariables>({
    mutationFn: login,
    onSuccess: (data, variables, context) => {
      if (data.isSuccess && data.data.token) {
        const { loginResModel, token } = data.data;

        setUser({
          userId: loginResModel.userId,
          fullName: loginResModel.fullName,
          role: loginResModel.role,
          email: loginResModel.email,
          phone: loginResModel.phone,
          address: loginResModel.address,
          status: loginResModel.status,
          createdAt: loginResModel.createdAt,
          updatedAt: loginResModel.updatedAt,
        });
        setToken(token);

        message.success("Đăng nhập thành công");
        options?.onSuccess?.(data, variables, context);
      } else {
        message.error("Đăng nhập thất bại");
      }
    },
    onError: (error: AxiosError | unknown, variables, context) => {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || error.message || "Lỗi máy chủ";
        message.error(errorMsg);
      } else {
        message.error("Lỗi máy chủ");
      }
      options?.onError?.(error as AxiosError, variables, context);
    },
    ...options,
  });
};

export default useLogin;
