"use client";
import { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import {
  getEmployeeShifts,
  deleteEmployeeShift,
} from "@/dbUtils/ManagerAPIs/shiftsservice";

interface EmployeeShift {
  employeeShiftId: number;
  employeeId: number;
  shiftId: number;
  month: number;
  employee: {
    employeeId: number;
    salary: number;
    specializedId: number;
    userId: number;
    user: {
      userName: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      address: string;
    };
  };
  shift: {
    shiftId: number;
    startTime: string;
    endTime: string;
  };
}

const EmployeeShiftManagementPage = () => {
  const [data, setData] = useState<EmployeeShift[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeShiftToDelete, setEmployeeShiftToDelete] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchEmployeeShifts();
  }, []);

  const fetchEmployeeShifts = async () => {
    setLoading(true);
    try {
      const response = await getEmployeeShifts();
      setData(response);
    } catch (error) {
      console.error("Error fetching employee shifts:", error);
      message.error("Failed to fetch employee shifts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employeeShiftId: number) => {
    setEmployeeShiftToDelete(employeeShiftId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeShiftToDelete === null) return;

    try {
      const response = await deleteEmployeeShift(employeeShiftToDelete);
      if (response.isSuccess) {
        message.success("Employee shift deleted successfully!");
        fetchEmployeeShifts(); // Reload bảng sau khi xóa thành công
      } else {
        message.error("Failed to delete employee shift.");
      }
    } catch (error) {
      console.error("Error deleting employee shift:", error);
      message.error("Failed to delete employee shift.");
    } finally {
      setIsDeleteModalOpen(false);
      setEmployeeShiftToDelete(null);
    }
  };

  const columns: ColumnsType<EmployeeShift> = [
    {
      title: "ID",
      dataIndex: "employeeShiftId",
      key: "employeeShiftId",
    },
    {
      title: "Employee Name",
      dataIndex: ["employee", "user", "fullName"],
      key: "employeeName",
    },
    {
      title: "Username",
      dataIndex: ["employee", "user", "userName"],
      key: "userName",
    },
    {
      title: "Shift",
      key: "shift",
      render: (_, record) =>
        `${record.shift.startTime} - ${record.shift.endTime}`,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteClick(record.employeeShiftId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <div className="text-xl font-semibold mb-4">
          Employee Shift Management
        </div>
      </div>
      <Table<EmployeeShift>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="employeeShiftId"
      />

      {/* Modal Confirm Delete */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEmployeeShiftToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this employee shift?</p>
      </Modal>
    </div>
  );
};

export default EmployeeShiftManagementPage;
