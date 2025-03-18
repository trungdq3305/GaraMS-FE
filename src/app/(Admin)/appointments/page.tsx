/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Input as AntInput,
  Space,
  Table,
  Modal,
  message,
  Tag,
  Descriptions,
  Avatar,
  Divider,
} from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/dbUtils/ManagerAPIs/appointmentsservice";

interface AppointmentService {
  serviceName: string;
  totalPrice: number;
}

interface CustomerInfo {
  customerId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  note: string;
}

interface DataType {
  key: string;
  appointmentId: number;
  date: string;
  status: string;
  vehicle: string;
  note: string;
  services: AppointmentService[];
  customerInfo: CustomerInfo;
}

type DataIndex = keyof DataType;

const AppointmentManagementPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [reason, setReason] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DataType | null>(null);

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAppointments();
        console.log(response);
        const appointments = response.data.map((item: any) => ({
          key: item.appointmentId.toString(),
          appointmentId: item.appointmentId,
          date: moment(item.date).format("DD/MM/YYYY HH:mm"),
          status: item.status,
          vehicle: item.vehicle
            ? `${item.vehicle.brand} - ${item.vehicle.model} (${item.vehicle.plateNumber})`
            : "No Vehicle Info", // Fallback text if vehicle is null or undefined
          note: item.note || "",
          services: item.appointmentServices.map((s: any) => ({
            serviceName: s.service?.serviceName || "Unknown Service",
            totalPrice: s.service?.totalPrice || 0,
          })),
          customerInfo: item.vehicle?.customer
            ? {
                customerId: item.vehicle.customer.customerId,
                fullName: item.vehicle.customer.user.fullName,
                phoneNumber: item.vehicle.customer.user.phoneNumber,
                email: item.vehicle.customer.user.email,
                address: item.vehicle.customer.user.address,
                gender: item.vehicle.customer.gender,
                note: item.vehicle.customer.note,
              }
            : null,
        }));
        setData(appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleAccept = async (appointmentId: number) => {
    try {
      await updateAppointmentStatus(appointmentId, "Accept", "1");
      setData((prevData) =>
        prevData.map((item) =>
          item.appointmentId === appointmentId
            ? { ...item, status: "Accept" }
            : item
        )
      );
      setSuccessMessage(
        `Appointment #${appointmentId} đã được Accept thành công.`
      );
      setSuccessModalVisible(true); // Hiển thị Modal
    } catch (error) {
      console.error("Error accepting appointment:", error);
      message.error(`Không thể Accept Appointment #${appointmentId}.`);
    }
  };

  const handleComplete = async (appointmentId: number) => {
    try {
      await updateAppointmentStatus(appointmentId, "Complete", "1");
      setData((prevData) =>
        prevData.map((item) =>
          item.appointmentId === appointmentId
            ? { ...item, status: "Complete" }
            : item
        )
      );
      setSuccessMessage(
        `Appointment #${appointmentId} đã được Complete thành công.`
      );
      setSuccessModalVisible(true); // Hiển thị Modal
    } catch (error) {
      console.error("Error completing appointment:", error);
      message.error(`Không thể Complete Appointment #${appointmentId}.`);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      message.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      await updateAppointmentStatus(
        selectedAppointmentId as number,
        "Reject",
        reason
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.appointmentId === selectedAppointmentId
            ? { ...item, status: "Reject" }
            : item
        )
      );
      setSuccessMessage(
        `Appointment #${selectedAppointmentId} đã được Reject thành công.`
      );
      setSuccessModalVisible(true); // Hiển thị Modal
      setRejectModalVisible(false);
      setReason("");
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      message.error(`Không thể Reject Appointment #${selectedAppointmentId}.`);
    }
  };

  const handleViewDetail = (record: DataType) => {
    setSelectedAppointment(record);
    setDetailModalVisible(true);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
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

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      sorter: (a, b) =>
        moment(a.appointmentId, "").valueOf() -
        moment(b.appointmentId, "").valueOf(),
    },
    {
      title: "Booked Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) =>
        moment(a.date, "DD/MM/YYYY HH:mm").valueOf() -
        moment(b.date, "DD/MM/YYYY HH:mm").valueOf(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status) => {
        let color = "";
        switch (status) {
          case "Accept":
            color = "green";
            break;
          case "Pending":
            color = "black";
            break;
          case "Reject":
            color = "red";
            break;
          case "Paid":
            color = "blue";
            break;
          case "Complete":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Vehicle",
      dataIndex: "vehicle",
      key: "vehicle",
      ...getColumnSearchProps("vehicle"),
    },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small" style={{ display: "flex" }}>
          <Button
            icon={<EyeOutlined />}
            type="default"
            style={{ width: "100px" }}
            onClick={() => handleViewDetail(record)}
          >
            Details
          </Button>

          {/* Accept button - show for Pending or Reject status */}
          {(record.status === "Pending" || record.status === "Reject") && (
            <Button
              icon={<EditOutlined />}
              style={{ width: "100px" }}
              onClick={() => handleAccept(record.appointmentId)}
            >
              Accept
            </Button>
          )}

          {/* Complete button - show only for Paid status */}
          {record.status === "Paid" && (
            <Button
              icon={<CheckCircleOutlined />}
              style={{ width: "100px" }}
              onClick={() => handleComplete(record.appointmentId)}
            >
              Complete
            </Button>
          )}

          {/* Reject button - show for Pending or Accept status, but not for Paid or Complete */}
          {/* Reject button - show for Pending or Accept status only (not for Paid or Complete) */}
          {(record.status === "Pending" || record.status === "Accept") && (
            <Button
              icon={<DeleteOutlined />}
              danger
              style={{ width: "100px" }}
              onClick={() => {
                setRejectModalVisible(true);
                setSelectedAppointmentId(record.appointmentId);
              }}
            >
              Reject
            </Button>
          )}

          {/* Placeholder to keep spacing when fewer buttons */}
          {(record.status === "Paid" ||
            record.status === "Complete" ||
            record.status === "Reject") && (
            <div style={{ width: "100px" }}></div>
          )}

          {/* Placeholder to keep spacing when fewer buttons */}
          {(record.status === "Paid" || record.status === "Complete") && (
            <div style={{ width: "100px" }}></div>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4">Appointments Management</div>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Modal Reject */}
      <Modal
        title="Reject Appointment"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setReason("");
        }}
      >
        <AntInput
          placeholder="Enter reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>

      {/* Modal Success */}
      <Modal
        title="Thông báo"
        open={successModalVisible}
        onOk={() => setSuccessModalVisible(false)}
        onCancel={() => setSuccessModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setSuccessModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        <p>{successMessage}</p>
      </Modal>

      {/* Detail Modal (Services + Customer Info) */}
      <Modal
        title={`Appointment Details #${selectedAppointment?.appointmentId}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setDetailModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedAppointment && (
          <div className="appointment-detail-container">
            {/* Appointment Info */}
            <Descriptions title="Appointment Information" bordered column={1}>
              <Descriptions.Item label="ID">
                {selectedAppointment.appointmentId}
              </Descriptions.Item>
              <Descriptions.Item label="Booked Date">
                {selectedAppointment.date}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedAppointment.status === "Accept"
                      ? "green"
                      : selectedAppointment.status === "Reject"
                      ? "red"
                      : selectedAppointment.status === "Paid"
                      ? "blue"
                      : selectedAppointment.status === "Complete"
                      ? "purple"
                      : "black"
                  }
                >
                  {selectedAppointment.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vehicle">
                {selectedAppointment.vehicle}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                {selectedAppointment.note || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {/* Services */}
            <Divider />
            <h3 className="text-lg font-semibold mb-3">Services</h3>
            <Table
              dataSource={selectedAppointment.services.map(
                (service, index) => ({
                  key: index,
                  ...service,
                })
              )}
              columns={[
                {
                  title: "Service Name",
                  dataIndex: "serviceName",
                  key: "serviceName",
                },
                {
                  title: "Price",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  render: (price) => `${price.toLocaleString()} VND`,
                },
              ]}
              pagination={false}
              size="small"
            />

            {/* Customer Info */}
            {selectedAppointment.customerInfo && (
              <>
                <Divider />
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <div className="flex items-center mb-4">
                  <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedAppointment.customerInfo.fullName}
                    </h2>
                    <p>
                      Customer ID: {selectedAppointment.customerInfo.customerId}
                    </p>
                  </div>
                </div>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Phone Number">
                    {selectedAppointment.customerInfo.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedAppointment.customerInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedAppointment.customerInfo.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {selectedAppointment.customerInfo.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Note">
                    {selectedAppointment.customerInfo.note || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentManagementPage;
