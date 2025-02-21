import axios from "axios";
import { useRouter } from "next/navigation";

export const axiosAuth = async (token: string, router: any) => {
  try {
    // Decode token (JWT payload)
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Kiểm tra role
    if (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "3") {
      router.push("/appointments");
    } else {
      router.push("/");
    }
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    router.push("/login"); // Quay lại trang đăng nhập nếu lỗi
  }
};
