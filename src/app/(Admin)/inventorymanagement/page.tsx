"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, message, Modal, Form, Input, Select, Divider, Tabs, Tag } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import moment from "moment";
import { getInventories, addInventory, updateInventory, deleteInventory } from "@/dbUtils/ManagerAPIs/inventoryService";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from "@/dbUtils/ManagerAPIs/supplierservice";

// Inventory interfaces and types
interface InventoryData {
    key: string;
    inventoryId: number;
    name: string;
    description: string;
    unit: string;
    price: number;
    status: boolean;
    createdAt: string;
}

// Supplier interfaces and types
interface SupplierData {
    key: string;
    supplierId: number;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
}

type InventoryDataIndex = keyof InventoryData;
type SupplierDataIndex = keyof SupplierData;

const InventoryAndSupplierManagementPage = () => {
    // Inventory state variables
    const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<InventoryData | null>(null);
    const [inventoryForm] = Form.useForm();
    const [editInventoryForm] = Form.useForm();
    const [isDeleteInventoryModalOpen, setIsDeleteInventoryModalOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
    const inventorySearchInput = useRef<InputRef>(null);

    // Supplier state variables
    const [supplierData, setSupplierData] = useState<SupplierData[]>([]);
    const [supplierLoading, setSupplierLoading] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<SupplierData | null>(null);
    const [supplierForm] = Form.useForm();
    const [editSupplierForm] = Form.useForm();
    const [isDeleteSupplierModalOpen, setIsDeleteSupplierModalOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const supplierSearchInput = useRef<InputRef>(null);
    const [activeTab, setActiveTab] = useState("inventory");
    useEffect(() => {
        fetchInventories();
        fetchSuppliers();
    }, []);

    // Inventory methods
    const fetchInventories = async () => {
        setInventoryLoading(true);
        try {
            const response = await getInventories();
            console.log(response);
            const inventories = response.data.map((item: any) => ({
                key: item.name.toString(),
                inventoryId: item.inventoryId,
                name: item.name,
                description: item.description,
                unit: item.unit,
                price: item.price,
                status: item.status,
                createdAt: moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
            }));
            setInventoryData(inventories);
        } catch (error) {
            console.error("Error fetching inventories:", error);
            message.error("Failed to fetch inventories.");
        } finally {
            setInventoryLoading(false);
        }
    };

    const handleEditInventoryClick = (inventory: InventoryData) => {
        setEditingInventory(inventory);
        editInventoryForm.setFieldsValue({
            name: inventory.name,
            price: inventory.price,
            description: inventory.description,
            unit: inventory.unit,
            status: inventory.status,
        });
        setIsEditInventoryModalOpen(true);
    };

    const handleEditInventory = async () => {
        try {
            const values = await editInventoryForm.validateFields();
            if (editingInventory) {
                await updateInventory(editingInventory.inventoryId, {
                    name: values.name,
                    description: values.description,
                    unit: values.unit,
                    price: parseFloat(values.price),
                    status: values.status,
                });
                message.success("Inventory item updated successfully!");
                setIsEditInventoryModalOpen(false);
                fetchInventories();
            }
        } catch (error) {
            console.error("Error updating inventory item:", error);
            message.error("Failed to update inventory item.");
        }
    };

    const handleDeleteInventory = (inventoryId: number) => {
        setSelectedInventoryId(inventoryId);
        setIsDeleteInventoryModalOpen(true);
    };

    const confirmDeleteInventory = async () => {
        if (!selectedInventoryId) return;
        try {
            await deleteInventory(selectedInventoryId);
            message.success("Inventory item deleted successfully!");
            fetchInventories();
        } catch (error) {
            console.error("Error deleting inventory item:", error);
            message.error("Failed to delete inventory item.");
        }
        setIsDeleteInventoryModalOpen(false);
    };

    const getInventoryColumnSearchProps = (dataIndex: InventoryDataIndex): TableColumnType<InventoryData> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <AntInput
                    ref={inventorySearchInput}
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
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()),
    });

    const inventoryColumns: ColumnsType<InventoryData> = [
        { title: "ID", dataIndex: "inventoryId", key: "inventoryId", sorter: (a, b) => a.inventoryId - b.inventoryId },
        { title: "Name", dataIndex: "name", key: "name", ...getInventoryColumnSearchProps("name") },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Unit", dataIndex: "unit", key: "unit" },
        { title: "Price", dataIndex: "price", key: "price", sorter: (a, b) => a.price - b.price },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
              { text: "Available", value: true },
              { text: "Out of Stock", value: false }
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
              const color = status ? "green" : "red";
              const text = status ? "Available" : "Out of Stock";
              return <Tag color={color}>{text}</Tag>;
            }
          },
          
        { title: "Created At", dataIndex: "createdAt", key: "createdAt", sorter: (a, b) => moment(a.createdAt, "DD/MM/YYYY HH:mm").valueOf() - moment(b.createdAt, "DD/MM/YYYY HH:mm").valueOf() },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEditInventoryClick(record)}>
                        Edit
                    </Button>
                    <Button danger onClick={() => handleDeleteInventory(record.inventoryId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAddInventory = async () => {
        try {
            const values = await inventoryForm.validateFields();
            await addInventory({
                name: values.name,
                description: values.description,
                unit: values.unit,
                price: parseFloat(values.price),
                status: values.status,
            });
            message.success("Inventory item added successfully!");
            setIsInventoryModalOpen(false);
            inventoryForm.resetFields();
            fetchInventories();
        } catch (error) {
            console.error("Error adding inventory item:", error);
            message.error("Failed to add inventory item.");
        }
    };

    // Supplier methods
    const fetchSuppliers = async () => {
        setSupplierLoading(true);
        try {
            const response = await getSuppliers();
            const suppliers = response.data.map((item: any) => ({
                key: item.supplierId.toString(),
                supplierId: item.supplierId,
                name: item.name,
                phone: item.phone,
                email: item.email,
                createdAt: moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
            }));
            setSupplierData(suppliers);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            message.error("Failed to fetch suppliers.");
        } finally {
            setSupplierLoading(false);
        }
    };

    const handleEditSupplierClick = (supplier: SupplierData) => {
        setEditingSupplier(supplier);
        editSupplierForm.setFieldsValue({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
        });
        setIsEditSupplierModalOpen(true);
    };

    const handleEditSupplier = async () => {
        try {
            const values = await editSupplierForm.validateFields();
            if (editingSupplier) {
                await updateSupplier(editingSupplier.supplierId, {
                    supplierId: editingSupplier.supplierId,
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                });
                message.success("Supplier updated successfully!");
                setIsEditSupplierModalOpen(false);
                fetchSuppliers();
            }
        } catch (error) {
            console.error("Error updating supplier:", error);
            message.error("Failed to update supplier.");
        }
    };

    const handleDeleteSupplier = (supplierId: number) => {
        setSelectedSupplierId(supplierId);
        setIsDeleteSupplierModalOpen(true);
    };

    const confirmDeleteSupplier = async () => {
        if (!selectedSupplierId) return;
        try {
            await deleteSupplier(selectedSupplierId);
            message.success("Supplier deleted successfully!");
            fetchSuppliers();
        } catch (error) {
            console.error("Error deleting supplier:", error);
            message.error("Failed to delete supplier.");
        }
        setIsDeleteSupplierModalOpen(false);
    };

    const getSupplierColumnSearchProps = (dataIndex: SupplierDataIndex): TableColumnType<SupplierData> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <AntInput
                    ref={supplierSearchInput}
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
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()),
    });

    const supplierColumns: ColumnsType<SupplierData> = [
        { title: "ID", dataIndex: "supplierId", key: "supplierId", sorter: (a, b) => a.supplierId - b.supplierId },
        { title: "Name", dataIndex: "name", key: "name", ...getSupplierColumnSearchProps("name") },
        { title: "Phone", dataIndex: "phone", key: "phone", ...getSupplierColumnSearchProps("phone") },
        { title: "Email", dataIndex: "email", key: "email", ...getSupplierColumnSearchProps("email") },
        { title: "Created At", dataIndex: "createdAt", key: "createdAt", sorter: (a, b) => moment(a.createdAt, "DD/MM/YYYY HH:mm").valueOf() - moment(b.createdAt, "DD/MM/YYYY HH:mm").valueOf() },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEditSupplierClick(record)}>
                        Edit
                    </Button>
                    <Button danger onClick={() => handleDeleteSupplier(record.supplierId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAddSupplier = async () => {
        try {
            const values = await supplierForm.validateFields();
            await addSupplier({
                supplierId: 0, // API will auto-generate the ID
                name: values.name,
                phone: values.phone,
                email: values.email,
            });
            message.success("Supplier added successfully!");
            setIsSupplierModalOpen(false);
            supplierForm.resetFields();
            fetchSuppliers();
        } catch (error) {
            console.error("Error adding supplier:", error);
            message.error("Failed to add supplier.");
        }
    };

    return (
        <div>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane tab="Inventory" key="inventory">
                    <div className="text-xl font-semibold mb-4 flex justify-between items-center">
                        <span>Inventory Management</span>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsInventoryModalOpen(true)}>
                            Add Item
                        </Button>
                    </div>

                    <Table<InventoryData>
                        columns={inventoryColumns}
                        dataSource={inventoryData}
                        loading={inventoryLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Supplier" key="supplier">
                    <div className="text-xl font-semibold mb-4 flex justify-between items-center">
                        <span>Supplier Management</span>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSupplierModalOpen(true)}>
                            Add Supplier
                        </Button>
                    </div>

                    <Table<SupplierData>
                        columns={supplierColumns}
                        dataSource={supplierData}
                        loading={supplierLoading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                    />
                </Tabs.TabPane>
            </Tabs>
            {/* Add Inventory Modal */}
            <Modal
                title="Add New Inventory Item"
                open={isInventoryModalOpen}
                onCancel={() => setIsInventoryModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsInventoryModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleAddInventory}>Add</Button>,
                ]}
            >
                <Form form={inventoryForm} layout="vertical">
                    <Form.Item
                        label="Item Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the item name" }]}
                    >
                        <Input placeholder="Enter item name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter the description" }]}
                    >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true, message: "Please enter the unit" }]}
                    >
                        <Input placeholder="Enter unit (e.g., kg, pcs, box)" />
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
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select a status" }]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value={true}>Available</Select.Option>
                            <Select.Option value={false}>Out of Stock</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Inventory Modal */}
            <Modal
                title="Edit Inventory Item"
                open={isEditInventoryModalOpen}
                onCancel={() => setIsEditInventoryModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsEditInventoryModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleEditInventory}>Save</Button>,
                ]}
            >
                <Form form={editInventoryForm} layout="vertical">
                    <Form.Item
                        label="Item Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the item name" }]}
                    >
                        <Input placeholder="Enter item name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter the description" }]}
                    >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true, message: "Please enter the unit" }]}
                    >
                        <Input placeholder="Enter unit (e.g., kg, pcs, box)" />
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
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select a status" }]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value={true}>Available</Select.Option>
                            <Select.Option value={false}>Out of Stock</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={isDeleteInventoryModalOpen}
                onCancel={() => setIsDeleteInventoryModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteInventoryModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={confirmDeleteInventory}>
                        Yes, Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this inventory item? This action cannot be undone.</p>
            </Modal>



            {/* Add Supplier Modal */}
            <Modal
                title="Add New Supplier"
                open={isSupplierModalOpen}
                onCancel={() => setIsSupplierModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsSupplierModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleAddSupplier}>Add</Button>,
                ]}
            >
                <Form form={supplierForm} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the item name" }]}
                    >
                        <Input placeholder="Enter item name" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please enter the phone" }]}
                    >
                        <Input.TextArea placeholder="Enter phone" rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter the email" }]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                </Form>
            </Modal>

            {/* Edit Inventory Modal */}
            <Modal
                title="Edit Supplier Item"
                open={isEditSupplierModalOpen}
                onCancel={() => setIsEditSupplierModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsEditSupplierModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleEditSupplier}>Save</Button>,
                ]}
            >
                <Form form={editSupplierForm} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the item name" }]}
                    >
                        <Input placeholder="Enter item name" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please enter the phone" }]}
                    >
                        <Input.TextArea placeholder="Enter phone" rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter the email" }]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={isDeleteSupplierModalOpen}
                onCancel={() => setIsDeleteSupplierModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteSupplierModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={confirmDeleteSupplier}>
                        Yes, Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this supplier item? This action cannot be undone.</p>
            </Modal>
        </div>

    );
};

export default InventoryAndSupplierManagementPage;