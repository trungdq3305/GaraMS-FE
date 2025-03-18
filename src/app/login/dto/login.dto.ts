export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
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
