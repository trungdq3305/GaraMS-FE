/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { Button, Input as AntInput, Space, Table, message, Form, Modal, Input, Select, Descriptions } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";
import axiosInstance from "@/dbUtils/axios";

interface WarrantyHistory {
  key: string;
  warrantyHistoryId: number;
  startDay: string;
  endDay: string;
  note: string;
  status: boolean;
  serviceId: number;
  appointmentId: number;
  serviceName?: string; // Optional field to display service name
}

interface AppointmentInfo {
  appointmentId: number;
  date: string;
  note: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  waitingTime: string | null;
  rejectReason: string;
  vehicleId: number;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    customer: {
      user: {
        userName: string;
        email: string;
        phoneNumber: string;
        fullName: string;
      }
    }
  };
  appointmentServices: Array<{
    serviceId: number;
    service: {
      serviceName: string;
    }
  }>;
}

type DataIndex = keyof WarrantyHistory;

const WarrantyManagementPage = () => {
  const [data, setData] = useState<WarrantyHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyHistory | null>(null);
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [servicesList, setServicesList] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    fetchWarrantyHistory();
    fetchServices();
  }, []);

  const fetchWarrantyHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("warrantyhistory");
      const warrantyData = response.data.data.map((item: any) => ({
        key: item.warrantyHistoryId.toString(),
        warrantyHistoryId: item.warrantyHistoryId,
        startDay: moment(item.startDay).format("DD/MM/YYYY HH:mm"),
        endDay: moment(item.endDay).format("DD/MM/YYYY HH:mm"),
        note: item.note,
        status: item.status,
        serviceId: item.serviceId,
        appointmentId: item.appointmentId,
      }));
      setData(warrantyData);
    } catch (error) {
      console.error("Error fetching warranty history:", error);
      message.error("Failed to fetch warranty history.");
    } finally {
      setLoading(false);
    }
  };
  
  type Service = {
    id: number;
    name: string;
  };
  
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("service/services");
      const services: Service[] = response.data.data.map((service: any) => ({
        id: service.serviceId,
        name: service.serviceName,
      }));
      setServicesList(services);
  
      // Update data with service names
      setData(prevData => 
        prevData.map(warranty => ({
          ...warranty,
          serviceName: services.find((s: Service) => s.id === warranty.serviceId)?.name || `Service ${warranty.serviceId}`
        }))
      );
    } catch (err) {
      message.error("Failed to load services.");
      console.error(err);
    }
  };

  const fetchAppointmentInfo = async (appointmentId: number) => {
    setAppointmentLoading(true);
    try {
      const response = await axiosInstance.get(`appointments/${appointmentId}`);
      setAppointmentInfo(response.data.data);
      setAppointmentModalVisible(true);
    } catch (error) {
      console.error("Error fetching appointment info:", error);
      message.error("Failed to fetch appointment information.");
    } finally {
      setAppointmentLoading(false);
    }
  };

  const handleEdit = (warranty: WarrantyHistory) => {
    setSelectedWarranty(warranty);
    form.setFieldsValue({
      ...warranty,
      startDay: moment(warranty.startDay, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm"),
      endDay: moment(warranty.endDay, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm"),
      status: warranty.status,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      await axiosInstance.put(`warrantyhistory/${selectedWarranty!.warrantyHistoryId}`, {
        startDay: moment(values.startDay).toISOString(),
        endDay: moment(values.endDay).toISOString(),
        note: selectedWarranty!.note,
        status: values.status,
        serviceId: selectedWarranty!.serviceId,
        appointmentId: selectedWarranty!.appointmentId,
      });
      message.success("Warranty history updated successfully!");
      setEditModalVisible(false);
      fetchWarrantyHistory();
    } catch (error) {
      console.error("Error updating warranty history:", error);
      message.error("Failed to update warranty history.");
    }
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

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<WarrantyHistory> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <AntInput
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => confirm({ closeDropdown: false })}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex] === undefined || record[dataIndex] === null) {
        return false;
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
  });

  const columns: ColumnsType<WarrantyHistory> = [
    { title: "ID", dataIndex: "warrantyHistoryId", key: "warrantyHistoryId" },
    {
      title: "Start Date",
      dataIndex: "startDay",
      key: "startDay",
      sorter: (a, b) =>
        moment(a.startDay, "DD/MM/YYYY HH:mm").valueOf() -
        moment(b.startDay, "DD/MM/YYYY HH:mm").valueOf(),
    },
    {
      title: "End Date",
      dataIndex: "endDay",
      key: "endDay",
      sorter: (a, b) =>
        moment(a.endDay, "DD/MM/YYYY HH:mm").valueOf() -
        moment(b.endDay, "DD/MM/YYYY HH:mm").valueOf(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <span style={{ color: status ? "green" : "red" }}>
          {status ? "Active" : "Inactive"}
        </span>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Service",
      dataIndex: "serviceId",
      key: "serviceId",
      render: (serviceId: number, record) => record.serviceName || `Service ${serviceId}`,
      filters: servicesList.map(service => ({ text: service.name, value: service.id })),
      onFilter: (value, record) => record.serviceId === value,
    },
    {
      title: "Appointment Info",
      dataIndex: "appointmentId",
      key: "appointmentId",
      render: (appointmentId: number) => (
        <Button 

          icon={<InfoCircleOutlined />} 
          onClick={() => fetchAppointmentInfo(appointmentId)}
        >
          View Details
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ border: "1px solid #d9d9d9" }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <div>Warranty Management</div>
      </div>
      <Table<WarrantyHistory>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
      
      {/* Edit Modal */}
      <Modal
        title="Edit Warranty"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {/* Start Date */}
          <Form.Item
            label="Start Date"
            name="startDay"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          {/* End Date */}
          <Form.Item
            label="End Date"
            name="endDay"
            dependencies={["startDay"]}
            rules={[
              { required: true, message: "Please select an end date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (moment(value).isSameOrBefore(getFieldValue("startDay"))) {
                    return Promise.reject(
                      new Error("End date must be after start date!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="datetime-local" />
          </Form.Item>
         
          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Appointment Details Modal */}
      <Modal
        title="Appointment Details"
        open={appointmentModalVisible}
        onCancel={() => setAppointmentModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAppointmentModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {appointmentLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading appointment details...</div>
        ) : appointmentInfo ? (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Appointment ID" span={2}>
              {appointmentInfo.appointmentId}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {moment(appointmentInfo.date).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span style={{ 
                color: 
                  appointmentInfo.status === "Completed" ? "green" : 
                  appointmentInfo.status === "Pending" ? "orange" : 
                  appointmentInfo.status === "Cancelled" ? "red" : "black" 
              }}>
                {appointmentInfo.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(appointmentInfo.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {moment(appointmentInfo.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Info" span={2}>
              {appointmentInfo.vehicle?.brand} {appointmentInfo.vehicle?.model} - Plate: {appointmentInfo.vehicle?.plateNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Info" span={2}>
              <p>Name: {appointmentInfo.vehicle?.customer?.user?.fullName}</p>
              <p>Username: {appointmentInfo.vehicle?.customer?.user?.userName}</p>
              <p>Email: {appointmentInfo.vehicle?.customer?.user?.email}</p>
              <p>Phone: {appointmentInfo.vehicle?.customer?.user?.phoneNumber}</p>
            </Descriptions.Item>
            <Descriptions.Item label="Services" span={2}>
              {appointmentInfo.appointmentServices?.map((service, index) => (
                <div key={index}>
                  {service.service?.serviceName || `Service ID: ${service.serviceId}`}
                </div>
              ))}
            </Descriptions.Item>
            {appointmentInfo.note && (
              <Descriptions.Item label="Note" span={2}>
                {appointmentInfo.note}
              </Descriptions.Item>
            )}
            
          </Descriptions>
        ) : (
          <div>No appointment information available</div>
        )}
      </Modal>
    </div>
  );
};

export default WarrantyManagementPage;