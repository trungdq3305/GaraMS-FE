import axiosInstance from "../axios";

// Interface để xác định cấu trúc dữ liệu
export interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

// Hàm lấy dữ liệu WeatherForecast từ API
export const getWeatherForecast = async (): Promise<WeatherForecast[]> => {
    try {
        const response = await axiosInstance.get<WeatherForecast[]>("/WeatherForecast");
        return response.data;
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        throw error;
    }
};
