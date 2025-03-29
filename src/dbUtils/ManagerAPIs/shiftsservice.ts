import axiosInstance from "../axios";

export const getShifts = async () => {
  const response = await axiosInstance.get("/employee/shift");
  return response.data;
};

export const getEmployeeShifts = async () => {
  const response = await axiosInstance.get("/employee/all-employee-shift");
  return response.data;
};

export const assignShiftToEmployee = async (
  employeeId: number,
  shiftId: number,
  month: number
) => {
  const response = await axiosInstance.post(
    `/employee/add-shift-to-employee?employeeId=${employeeId}&shiftId=${shiftId}&month=${month}`
  );
  return response.data;
};

export const deleteEmployeeShift = async (employeeShiftId: number) => {
  const response = await axiosInstance.delete(
    `/employee/employee-shift?employeeShiftId=${employeeShiftId}`
  );
  return response.data;
};
