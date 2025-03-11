/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { Button, Input as AntInput, Space, Table, message,Form , Modal, Input, Select } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import moment from "moment";
import { getPromotions, updatePromotion, deletePromotion, createPromotion  } from "@/dbUtils/ManagerAPIs/promorionService";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "@/dbUtils/axios"
interface Promotion {
  key: string;
  promotionId: number;
  promotionName: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  serviceIds: number[];
}

type DataIndex = keyof Promotion;

const PromotionManagementPage = () => {
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
const [servicesList, setServicesList] = useState<{ id: number; name: string }[]>([]);
const [addForm] = Form.useForm();
  const [form] = Form.useForm();
  const searchInput = useRef<InputRef>(null);
  useEffect(() => {
    fetchPromotions();
  }, []);
  const fetchPromotions = async () => {
    setLoading(true);
    try {
        const response = await getPromotions();
        console.log(response);
        const promotions = response.map((item: any) => ({
          key: item.promotionId.toString(),
          promotionId: item.promotionId,
          promotionName: item.promotionName,
          startDate: moment(item.startDate).format("DD/MM/YYYY HH:mm"),
          endDate: moment(item.endDate).format("DD/MM/YYYY HH:mm"),
          discountPercent: item.discountPercent,
          serviceIds: item.serviceIds,
        }));
        setData(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      message.error("Failed to fetch promotions.");
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
  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    form.setFieldsValue({
      ...promotion,
      startDate: moment(promotion.startDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm"),
      endDate: moment(promotion.endDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm"),
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      await updatePromotion(selectedPromotion!.promotionId, {
        promotionName: values.promotionName,
        startDate: moment(values.startDate).toISOString(),
        endDate: moment(values.endDate).toISOString(),
        discountPercent: values.discountPercent,
      });

      message.success("Promotion updated successfully!");
      setEditModalVisible(false);
      fetchPromotions();
    } catch (error) {
      console.error("Error updating promotion:", error);
      message.error("Failed to update promotion.");
    }
  };
  const handleAddPromotion = async () => {
    try {
        const values = addForm.getFieldsValue();
        await createPromotion({
            promotionName: values.promotionName,
            startDate: moment(values.startDate).toISOString(),
            endDate: moment(values.endDate).toISOString(),
            discountPercent: values.discountPercent,
            serviceIds: values.serviceIds,
        });

        message.success("Promotion added successfully!");
        setAddModalVisible(false);
        fetchPromotions();
        addForm.resetFields();
    } catch (error) {
        console.error("Error adding promotion:", error);
        message.error("Failed to add promotion.");
    }
};

  const handleDelete = async () => {
    try {
      await deletePromotion(selectedPromotion!.promotionId);
      message.success("Promotion deleted successfully!");
      setDeleteModalVisible(false);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      message.error("Failed to delete promotion.");
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
  ): TableColumnType<Promotion> => ({
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
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<Promotion> = [
    { title: "ID", dataIndex: "promotionId", key: "promotionId" },
    {
      title: "Promotion Name",
      dataIndex: "promotionName",
      key: "promotionName",
      ...getColumnSearchProps("promotionName"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) =>
        moment(a.startDate, "DD/MM/YYYY HH:mm").valueOf() -
        moment(b.startDate, "DD/MM/YYYY HH:mm").valueOf(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) =>
        moment(a.endDate, "DD/MM/YYYY HH:mm").valueOf() -
        moment(b.endDate, "DD/MM/YYYY HH:mm").valueOf(),
    },
    {
      title: "Discount (%)",
      dataIndex: "discountPercent",
      key: "discountPercent",
      sorter: (a, b) => a.discountPercent - b.discountPercent,
    },
    {
      title: "Service IDs",
      dataIndex: "serviceIds",
      key: "serviceIds",
      render: (serviceIds: number[]) => serviceIds.join(", "),
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
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => { setSelectedPromotion(record); setDeleteModalVisible(true); }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
  ];

  return (
    <div>
        <div className="text-xl font-semibold mb-4 flex justify-between items-center">
      <div className="text-xl font-semibold mb-4">Promotions Management</div>
      <Button type="primary" onClick={() => setAddModalVisible(true)} style={{ marginBottom: 16 }}>
    Add Promotion
</Button>
</div>
      <Table<Promotion>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
      {/* Edit Modal */}
      <Modal
        title="Edit Promotion"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
  {/* Promotion Name */}
  <Form.Item
    label="Promotion Name"
    name="promotionName"
    rules={[{ required: true, message: "Please enter promotion name!" }]}
  >
    <Input />
  </Form.Item>

  {/* Start Date */}
  <Form.Item
    label="Start Date"
    name="startDate"
    rules={[
      { required: true, message: "Please select a start date!" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value) return Promise.resolve();
          if (moment(value).isBefore(moment(), "day")) {
            return Promise.reject(new Error("Start date cannot be before today!"));
          }
          return Promise.resolve();
        },
      }),
    ]}
  >
    <Input type="datetime-local" />
  </Form.Item>

  {/* End Date */}
  <Form.Item
    label="End Date"
    name="endDate"
    dependencies={["startDate"]}
    rules={[
      { required: true, message: "Please select an end date!" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value) return Promise.resolve();
          if (moment(value).isSameOrBefore(getFieldValue("startDate"))) {
            return Promise.reject(new Error("End date must be after start date!"));
          }
          return Promise.resolve();
        },
      }),
    ]}
  >
    <Input type="datetime-local" />
  </Form.Item>

  {/* Discount Percent */}
  <Form.Item
    label="Discount Percent"
    name="discountPercent"
    rules={[
      { required: true, message: "Please enter discount percent!" },
      {
        type: "number",
        min: 1,
        max: 99,
        message: "Discount must be between 1% and 99%!",
      },
    ]}
  >
    <Input type="number" />
  </Form.Item>
</Form>

      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this promotion?</p>
      </Modal>
      <Modal
    title="Add Promotion"
    open={addModalVisible}
    onOk={handleAddPromotion}
    onCancel={() => setAddModalVisible(false)}
>
    <Form form={addForm} layout="vertical">
        {/* Promotion Name */}
        <Form.Item
            label="Promotion Name"
            name="promotionName"
            rules={[{ required: true, message: "Please enter promotion name!" }]}
        >
            <Input />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
                { required: true, message: "Please select a start date!" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value) return Promise.resolve();
                        if (moment(value).isBefore(moment(), "day")) {
                            return Promise.reject(new Error("Start date cannot be before today!"));
                        }
                        return Promise.resolve();
                    },
                }),
            ]}
        >
            <Input type="datetime-local" />
        </Form.Item>

        {/* End Date */}
        <Form.Item
            label="End Date"
            name="endDate"
            dependencies={["startDate"]}
            rules={[
                { required: true, message: "Please select an end date!" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value) return Promise.resolve();
                        if (moment(value).isSameOrBefore(getFieldValue("startDate"))) {
                            return Promise.reject(new Error("End date must be after start date!"));
                        }
                        return Promise.resolve();
                    },
                }),
            ]}
        >
            <Input type="datetime-local" />
        </Form.Item>

        {/* Discount Percent */}
        <Form.Item
            label="Discount Percent"
            name="discountPercent"
            rules={[
                { required: true, message: "Please enter discount percent!" },
                { type: "number", min: 1, max: 99, message: "Discount must be between 1% and 99%!" },
            ]}
        >
            <Input type="number" />
        </Form.Item>

        {/* Select Services */}
        <Form.Item
            label="Select Services"
            name="serviceIds"
            rules={[{ required: true, message: "Please select at least one service!" }]}
        >
            <Select mode="multiple" placeholder="Select services">
                {servicesList.map(service => (
                    <Select.Option key={service.id} value={service.id}>
                        {service.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    </Form>
</Modal>

    </div>
  );
};

export default PromotionManagementPage;
