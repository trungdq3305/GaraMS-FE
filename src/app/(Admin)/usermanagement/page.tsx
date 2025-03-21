"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, message, Modal, Form, Input, Descriptions, Tag, Select } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import moment from "moment";
import { getUsers, updateUser, createUser, confirmUserStatus } from "@/dbUtils/AdminAPIs/userservice";

const { Option } = Select;

interface UserData {
  key: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: boolean;
  roleId: string;
  createdAt: string;
  updatedAt?: string;
  address?: string;
  dateOfBirth?: string;
}

type DataIndex = keyof UserData;

const UserManagementPage = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [detailUser, setDetailUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const searchInput = useRef<InputRef>(null);
  const [addForm] = Form.useForm();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      const users = response.data.map((item: any) => ({
        key: item.userId.toString(),
        userId: item.userId,
        username: item.userName,
        email: item.email,
        fullName: item.fullName,
        phoneNumber: item.phoneNumber,
        status: item.status,
        roleId: item.roleId,
        createdAt: moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
        updatedAt: item.updatedAt ? moment(item.updatedAt).format("DD/MM/YYYY HH:mm") : undefined,
        address: item.address,
        dateOfBirth: item.dateOfBirth ? moment(item.dateOfBirth).format("DD/MM/YYYY") : undefined,
      }));
      console.log(users)
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddUser = async () => {
    try {
      const values = await addForm.validateFields();
      await createUser({
        userName: values.username,
        password: values.password,
        email: values.email,
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        address: values.address,
        roleId: values.roleId,
      });
      message.success("User created successfully!");
      setIsModalOpen(false);
      addForm.resetFields();
      fetchUsers(); // Cập nhật danh sách sau khi thêm
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Failed to add user.");
    }
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      phone: user.phoneNumber,
      email: user.email,
      fullName: user.fullName,
      address: user.address,
    });
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (user: UserData) => {
    setDetailUser(user);
    console.log(user)
    setIsDetailModalOpen(true);
  };

  const handleEditUser = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingUser) {
        await updateUser(editingUser.userId, {
          phone: values.phone,
          email: values.email,
          fullName: values.fullName,
          address: values.address,
        });
        message.success("User updated successfully!");
        setIsEditModalOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user.");
    }
  };



  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<UserData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <AntInput
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">
            Search
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small">Reset</Button>
          <Button type="link" size="small" onClick={() => close()}>Close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) => Boolean(record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase())),
  });
  const handleConfirmStatus = async (userId: number) => {
    try {
      await confirmUserStatus(userId);
      message.success("User status confirmed successfully!");
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      console.error("Error confirming status:", error);
      message.error("Failed to confirm user status.");
    }
  };

  const columns: ColumnsType<UserData> = [
    { title: "ID", dataIndex: "userId", key: "userId", sorter: (a, b) => a.userId - b.userId },
    { title: "Username", dataIndex: "username", key: "username", ...getColumnSearchProps("username") },
    { title: "Full Name", dataIndex: "fullName", key: "fullName", ...getColumnSearchProps("fullName") },
    { title: "Email", dataIndex: "email", key: "email", ...getColumnSearchProps("email") },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      filters: [
        { text: "Admin", value: "4" },
        { text: "Manager", value: "3" },
        { text: "Employee", value: "2" },
        { text: "Customer", value: "1" }
      ],
      onFilter: (value, record) => record.roleId === value,
      render: (roleId: string | number) => {
        const roleMapping: Record<string, string> = {
          "4": "Admin",
          "3": "Manager",
          "2": "Employee",
          "1": "Customer"
        };

        // Chuyển roleId thành string để đảm bảo nó có thể dùng làm key
        const role = roleMapping[String(roleId)] || "Unknown";

        let color = "blue";
        if (role === "Admin") color = "red";
        else if (role === "Manager") color = "purple";
        else if (role === "Employee") color = "green";

        return <Tag color={color}>{role}</Tag>;
      }
    }

    ,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>)
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", sorter: (a, b) => moment(a.createdAt, "DD/MM/YYYY HH:mm").valueOf() - moment(b.createdAt, "DD/MM/YYYY HH:mm").valueOf() },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<InfoCircleOutlined />} onClick={() => handleDetailClick(record)}>
            Detail
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          {record.status === false && (
            <Button
              type="primary"
              onClick={() => handleConfirmStatus(record.userId)}
            >
              Confirm
            </Button>
          )}
        </Space>
      ),
    },


  ];



  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Users Management</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add User
        </Button>
      </div>

      <Table<UserData>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />



      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleEditUser}>Save</Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter the Phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>
          
        </Form>
      </Modal>



      {/* User Detail Modal */}
      <Modal
        title="User Details"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {detailUser && (
          <div className="user-detail-container">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="User ID" span={2}>{detailUser.userId}</Descriptions.Item>
              <Descriptions.Item label="Username" span={2}>{detailUser.username}</Descriptions.Item>
              <Descriptions.Item label="Full Name" span={2}>{detailUser.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{detailUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{detailUser.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={{
                  "4": "red",      // Admin
                  "3": "purple",   // Manager
                  "2": "green",    // Employee
                  "1": "blue"      // Customer
                }[String(detailUser.roleId)] || "gray"}>
                  {{
                    "4": "Admin",
                    "3": "Manager",
                    "2": "Employee",
                    "1": "Customer"
                  }[String(detailUser.roleId)] || "Unknown"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color={detailUser.status ? "green" : "red"}>
                  {detailUser.status ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Address" span={2}>{detailUser.address || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{detailUser.dateOfBirth || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Created At">{detailUser.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Updated At">{detailUser.updatedAt || 'N/A'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
      {/* Add User Modal */}
      <Modal
        title="Add User"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          addForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAddUser}>Add</Button>,
        ]}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Role" name="roleId" rules={[{ required: true, message: "Please select a role" }]}>
            <Select placeholder="Select role">
              <Option value={3}>Manager</Option>
              <Option value={2}>Employee</Option>
              <Option value={1}>Customer</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default UserManagementPage;