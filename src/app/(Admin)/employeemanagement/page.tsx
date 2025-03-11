
"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, Modal, message, Form, Select } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
} from "@/dbUtils/ManagerAPIs/employeeservice";
import { getSpecializations, assignServiceToEmployee } from "@/dbUtils/ManagerAPIs/employeeservice"; // API lấy danh sách chuyên môn
import axiosInstance from "@/dbUtils/axios";
interface Employee {
  key: string;
  employeeId: number;
  salary: number;
  specializedId: number;
  userId: number;
  user?: User;  // Ensure this exists if user data is included
  serviceEmployees: { service: Service }[];
}

interface Specialized {
  specializedId: number;
  specializedName: string;
}
interface User {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
  }
  
  interface Service {
    serviceId: number;
    serviceName: string;
    description: string;
    totalPrice: number;
  }
type DataIndex = keyof Employee;

const EmployeeManagementPage = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [specializedList, setSpecializedList] = useState<Specialized[]>([]);
  const [servicesList, setServicesList] = useState<{ id: number; name: string }[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<Employee | null>(null);
  
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    fetchEmployees();
    fetchSpecializedList();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
  
      const filteredEmployees = response.data
        .filter((item: any) => item.userId !== null)
        .map((item: any) => ({
          key: item.employeeId.toString(),
          employeeId: item.employeeId,
          salary: item.salary,
          specializedId: item.specializedId,
          userId: item.userId,
          user: item.user || null, // Đảm bảo 'user' tồn tại
        }));
  
      setData(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("service/services");
        const services = response.data.data.map((service: any) => ({
          id: service.serviceId,
          name: service.serviceName,
        }));
        setServicesList(services);
      } catch (err) {
        message.error("Failed to load services.");
        console.error(err);
      }
    };
  
    fetchServices();
  }, []);
  
  const handleAssignServiceClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsServiceModalOpen(true);
  };
  const handleAssignService = async () => {
    if (!selectedEmployee || selectedServiceId === null) {
      message.error("Please select a service.");
      return;
    }
  
    try {
      await assignServiceToEmployee(selectedEmployee.employeeId, selectedServiceId);
      message.success(`Service assigned to Employee #${selectedEmployee.employeeId} successfully!`);
      setIsServiceModalOpen(false);
      setSelectedServiceId(null);
    } catch (error) {
      console.error("Error assigning service:", error);
      message.error("Failed to assign service.");
    }
  };
    
  const fetchSpecializedList = async () => {
    try {
      const response = await getSpecializations();
      console.log(response)
      if (response) {
        console.log(response)
        setSpecializedList(response);
      } else {
        setSpecializedList([]);
      }
    } catch (error) {
      console.error("Error fetching specialized list:", error);
      message.error("Failed to fetch specialized list.");
      setSpecializedList([]); // Ensure the state is still an array
    }
  };

  const handleAddEmployee = async () => {
    try {
      const values = await form.validateFields();
      if (editingEmployee) {
        await updateEmployee(editingEmployee.employeeId, {
          salary: values.salary,
          specializedId: values.specializedId,
        });
        message.success(`Employee #${editingEmployee.employeeId} updated successfully!`);
      } else {
        await addEmployee({
          salary: values.salary,
          specializedId: values.specializedId,
          userId: values.userId,
        });
        message.success("Employee added successfully!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      message.error("Failed to save employee data.");
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      salary: employee.salary,
      specializedId: employee.specializedId,
    });
    setIsModalOpen(true);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Employee> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <AntInput
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      Boolean(record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase())),
  });

  const columns: ColumnsType<Employee> = [
    { title: "ID", dataIndex: "employeeId", key: "employeeId" },
    { title: "Salary", dataIndex: "salary", key: "salary", sorter: (a, b) => a.salary - b.salary },
    {
      title: "Specialized",
      dataIndex: "specializedId",
      key: "specializedId",
      render: (specializedId) => specializedList.find((spec) => spec.specializedId === specializedId)?.specializedName || specializedId,
    },
    { title: "User ID", dataIndex: "userId", key: "userId" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)}>Edit</Button>
          <Button icon={<PlusOutlined />} onClick={() => handleAssignServiceClick(record)}>Assign Service</Button>
          <Button onClick={() => handleDetailClick(record)}>Infomation</Button>
        </Space>
      ),
    },
  ];
  const handleDetailClick = (employee: Employee) => {
    console.log(employee)
    setSelectedEmployeeDetails(employee);
    setIsDetailModalOpen(true);
  };
  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <div className="text-xl font-semibold mb-4">Employee Management</div>
      </div>
      <Table<Employee> columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} />

      {/* Modal Add/Edit */}
      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={isModalOpen}
        onOk={handleAddEmployee}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Salary" name="salary" rules={[{ required: true, message: "Please enter salary" }]}>
            <AntInput type="number" placeholder="Enter salary" />
          </Form.Item>
          <Form.Item 
  label="Specialized" 
  name="specializedId" 
  rules={[{ required: true, message: "Please select specialized" }]}
>
  <Select 
    loading={specializedList.length === 0} // Show loading state
    options={specializedList?.map((spec) => ({
      value: spec.specializedId, 
      label: spec.specializedName
    })) || []} 
  />
</Form.Item>
        </Form>
      </Modal>
      <Modal
  title="Assign Service to Employee"
  open={isServiceModalOpen}
  onOk={handleAssignService}
  onCancel={() => setIsServiceModalOpen(false)}
>
  <Select
    style={{ width: "100%" }}
    placeholder="Select a service"
    value={selectedServiceId}
    onChange={setSelectedServiceId}
    options={servicesList.map((service) => ({
      value: service.id,
      label: service.name,
    }))}
  />
</Modal>
<Modal
  title="Employee Details"
  open={isDetailModalOpen}
  onCancel={() => setIsDetailModalOpen(false)}
  footer={null}
>
  {selectedEmployeeDetails && (
    <div>
      {selectedEmployeeDetails.user ? (
        <ul>
          <li><strong>Name:</strong> {selectedEmployeeDetails.user.fullName}</li>
          <li><strong>Email:</strong> {selectedEmployeeDetails.user.email}</li>
          <li><strong>Phone:</strong> {selectedEmployeeDetails.user.phoneNumber}</li>
          <li><strong>Address:</strong> {selectedEmployeeDetails.user.address}</li>
        </ul>
      ) : <p>No user information available.</p>}
      
    </div>
  )}
</Modal>
    </div>
  );
};

export default EmployeeManagementPage;
