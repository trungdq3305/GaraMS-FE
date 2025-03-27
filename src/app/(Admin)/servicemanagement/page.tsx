"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, message, Modal, Form, Input, Descriptions, Tag, List, Typography } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import moment from "moment";
import { getServices, addService, updateService, deleteService } from "@/dbUtils/ManagerAPIs/serviceservice";

const { Title, Text } = Typography;

interface Employee {
  employeeId: number;
  fullName?: string;
  user?: {
    fullName: string;
  };
}

interface Inventory {
  inventoryId: number;
  name: string;
  description: string;
  price: number;
  unit: string;
}

interface Promotion {
  promotionId: number;
  promotionName: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
}

interface ServiceData {
  key: string;
  serviceId: number;
  serviceName: string;
  description: string;
  totalPrice: number;
  status: boolean;
  createdAt: string;
  servicePrice?: number;
  inventoryPrice?: number;
  promotion?: number;
  estimatedTime?: number;
  warrantyPeriod?: number;
  categoryId?: number;
  category?: { categoryName?: string };
  serviceEmployees?: Array<{ employee: Employee }>;
  serviceInventories?: Array<{ inventory: Inventory }>;
  servicePromotions?: Array<{ promotion: Promotion }>;
  updatedAt?: string;
}

type DataIndex = keyof ServiceData;

const ServiceManagementPage = () => {
  const [data, setData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [detailService, setDetailService] = useState<ServiceData | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();
      const services = response.data.map((item: any) => ({
        key: item.serviceId.toString(),
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        description: item.description,
        totalPrice: item.totalPrice,
        status: item.status,
        createdAt: moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
        // Store all full service data for detail view
        servicePrice: item.servicePrice,
        inventoryPrice: item.inventoryPrice,
        promotion: item.promotion,
        estimatedTime: item.estimatedTime,
        warrantyPeriod: item.warrantyPeriod,
        categoryId: item.categoryId,
        category: item.category,
        serviceEmployees: item.serviceEmployees,
        serviceInventories: item.serviceInventories,
        servicePromotions: item.servicePromotions,
        updatedAt: item.updatedAt ? moment(item.updatedAt).format("DD/MM/YYYY HH:mm") : undefined,
      }));
      console.log(services)
      setData(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      message.error("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service: ServiceData) => {
    setEditingService(service);
    editForm.setFieldsValue({
      serviceName: service.serviceName,
      price: service.totalPrice,
      description: service.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (service: ServiceData) => {
    setDetailService(service);
    setIsDetailModalOpen(true);
  };

  const handleEditService = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingService) {
        await updateService(editingService.serviceId, {
          serviceId: editingService.serviceId,
          serviceName: values.serviceName,
          servicePrice: parseFloat(values.price),
          description: values.description,
          warrantyPeriod: values.warrantyPeriod || 0, // Add warranty period, default to 0 if not provided
        });
        message.success("Service updated successfully!");
        setIsEditModalOpen(false);
        fetchServices();
      }
    } catch (error) {
      console.error("Error updating service:", error);
      message.error("Failed to update service.");
    }
  };

  const handleDeleteService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedServiceId) return;
    try {
      await deleteService(selectedServiceId);
      message.success("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      message.error("Failed to delete service.");
    }
    setIsDeleteModalOpen(false);
  };
  
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ServiceData> => ({
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
    onFilter: (value, record) =>  Boolean(record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase())),
  });

  const columns: ColumnsType<ServiceData> = [
    { title: "ID", dataIndex: "serviceId", key: "serviceId", sorter: (a, b) => a.serviceId - b.serviceId },
    { title: "Name", dataIndex: "serviceName", key: "serviceName", ...getColumnSearchProps("serviceName") },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", sorter: (a, b) => a.totalPrice - b.totalPrice },
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
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteService(record.serviceId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddService = async () => {
    try {
      const values = await form.validateFields();
      await addService({
        serviceId: 0, // API will automatically create the ID
        serviceName: values.serviceName,
        servicePrice: parseFloat(values.price),
        description: values.description,
        warrantyPeriod: values.warrantyPeriod || 0, // Add warranty period, default to 0 if not provided
      });
      message.success("Service added successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchServices(); // Reload service list
    } catch (error) {
      console.error("Error adding service:", error);
      message.error("Failed to add service.");
    }
  };

  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Services Management</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Service
        </Button>
      </div>

      <Table<ServiceData>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Add Service Modal */}
<Modal
  title="Add New Service"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={handleAddService}>Add</Button>,
  ]}
>
  <Form form={form} layout="vertical">
    <Form.Item
      label="Service Name"
      name="serviceName"
      rules={[{ required: true, message: "Please enter the service name" }]}
    >
      <Input placeholder="Enter service name" />
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[
        { required: true, message: "Please enter the price" },
        { pattern: /^\d+(\.\d{1,2})?$/, message: "Enter a valid price" },
      ]}
    >
      <Input placeholder="Enter price" type="number" />
    </Form.Item>

    <Form.Item
      label="Warranty Period (days)"
      name="warrantyPeriod"
      rules={[
        { pattern: /^\d+$/, message: "Enter a valid number of days" },
      ]}
    >
      <Input placeholder="Enter warranty period (optional)" type="number" />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: "Please enter the description" }]}
    >
      <Input.TextArea placeholder="Enter description" rows={3} />
    </Form.Item>
  </Form>
</Modal>

{/* Edit Service Modal */}
<Modal
  title="Edit Service"
  open={isEditModalOpen}
  onCancel={() => setIsEditModalOpen(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={handleEditService}>Save</Button>,
  ]}
>
  <Form form={editForm} layout="vertical">
    <Form.Item
      label="Service Name"
      name="serviceName"
      rules={[{ required: true, message: "Please enter the service name" }]}
    >
      <Input placeholder="Enter service name" />
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[
        { required: true, message: "Please enter the price" },
        { pattern: /^\d+(\.\d{1,2})?$/, message: "Enter a valid price" },
      ]}
    >
      <Input placeholder="Enter price" type="number" />
    </Form.Item>

    

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: "Please enter the description" }]}
    >
      <Input.TextArea placeholder="Enter description" rows={3} />
    </Form.Item>
  </Form>
</Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" danger onClick={confirmDelete}>
            Yes, Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this service? This action cannot be undone.</p>
      </Modal>

      {/* Service Detail Modal */}
      <Modal
        title="Service Details"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={800}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {detailService && (
          <div className="service-detail-container">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Service ID" span={2}>{detailService.serviceId}</Descriptions.Item>
              <Descriptions.Item label="Service Name" span={2}>{detailService.serviceName}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>{detailService.description}</Descriptions.Item>
              <Descriptions.Item label="Service Price">${detailService.servicePrice}</Descriptions.Item>
              <Descriptions.Item label="Inventory Price">${detailService.inventoryPrice}</Descriptions.Item>
              <Descriptions.Item label="Promotion Discount">${detailService.promotion}</Descriptions.Item>
              <Descriptions.Item label="Total Price">${detailService.totalPrice}</Descriptions.Item>
              <Descriptions.Item label="Estimated Time">{detailService.estimatedTime} minutes</Descriptions.Item>
              <Descriptions.Item label="Warranty Period">{detailService.warrantyPeriod} days</Descriptions.Item>
              <Descriptions.Item label="Status">
                {detailService.status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Category">{detailService.category?.categoryName || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Created At">{detailService.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Updated At">{detailService.updatedAt || 'N/A'}</Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <Title level={5}>Employees</Title>
              {detailService.serviceEmployees && detailService.serviceEmployees.length > 0 ? (
                <List
                  bordered
                  dataSource={detailService.serviceEmployees}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>
                        ID: {item.employee.employeeId} - 
                        Name: {item.employee.user?.fullName || item.employee.fullName || 'N/A'}
                      </Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>No employees assigned</Text>
              )}
            </div>

            <div className="mt-4">
              <Title level={5}>Inventories</Title>
              {detailService.serviceInventories && detailService.serviceInventories.length > 0 ? (
                <List
                  bordered
                  dataSource={detailService.serviceInventories}
                  renderItem={(item) => (
                    <List.Item>
                      <div>
                        <div><Text strong>Name:</Text> {item.inventory.name}</div>
                        <div><Text strong>Description:</Text> {item.inventory.description}</div>
                        <div><Text strong>Price:</Text> ${item.inventory.price}</div>
                        <div><Text strong>Unit:</Text> {item.inventory.unit}</div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>No inventories assigned</Text>
              )}
            </div>

            <div className="mt-4">
              <Title level={5}>Promotions</Title>
              {detailService.servicePromotions && detailService.servicePromotions.length > 0 ? (
                <List
                  bordered
                  dataSource={detailService.servicePromotions}
                  renderItem={(item) => (
                    <List.Item>
                      <div>
                        <div><Text strong>Name:</Text> {item.promotion.promotionName}</div>
                        <div><Text strong>Discount:</Text> {item.promotion.discountPercent}%</div>
                        <div><Text strong>Valid Period:</Text> {moment(item.promotion.startDate).format("DD/MM/YYYY")} - {moment(item.promotion.endDate).format("DD/MM/YYYY")}</div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>No active promotions</Text>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceManagementPage;