"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, Modal, message } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axios from "axios";
import moment from "moment";

interface AppointmentService {
  serviceName: string;
  totalPrice: number;
}

interface DataType {
  key: string;
  appointmentId: number;
  date: string;
  status: string;
  vehicle: string;
  note: string;
  services: AppointmentService[];
}

type DataIndex = keyof DataType;

const WorkVolumePage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://localhost:7102/api/appointments");
        const appointments = response.data.map((item: any) => ({
          key: item.appointmentId.toString(),
          appointmentId: item.appointmentId,
          date: moment(item.date).format("DD/MM/YYYY HH:mm"),
          status: item.status,
          vehicle: `${item.vehicle.brand} - ${item.vehicle.model} (${item.vehicle.plateNumber})`,
          note: item.note || "",
          services: item.appointmentServices.map((s: any) => ({
            serviceName: s.service.serviceName,
            totalPrice: s.service.totalPrice,
          })),
        }));
        setData(appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      await axios.put(`https://localhost:7102/api/appointments/status-update/${appointmentId}?status=Accept&reason=1`);
      message.success("Appointment accepted successfully.");
      setData((prevData) =>
        prevData.map((item) =>
          item.appointmentId === appointmentId ? { ...item, status: "Accept" } : item
        )
      );
    } catch (error) {
      console.error("Error accepting appointment:", error);
      message.error("Failed to accept appointment.");
    }
  };

  const handleReject = async () => {
    if (!reason) {
      message.error("Please provide a reason for rejection.");
      return;
    }

    try {
      await axios.put(`https://localhost:7102/api/appointments/status-update/${selectedAppointmentId}?status=Reject&reason=${reason}`);
      message.success("Appointment rejected successfully.");
      setData((prevData) =>
        prevData.map((item) =>
          item.appointmentId === selectedAppointmentId ? { ...item, status: "Reject" } : item
        )
      );
      setRejectModalVisible(false);
      setReason("");
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      message.error("Failed to reject appointment.");
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
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
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => confirm({ closeDropdown: false })}>
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<DataType> = [
    { title: "ID", dataIndex: "appointmentId", key: "appointmentId" },
    { title: "Booked Date", dataIndex: "date", key: "date", sorter: (a, b) => moment(a.date, "DD/MM/YYYY HH:mm").valueOf() - moment(b.date, "DD/MM/YYYY HH:mm").valueOf() },
    { title: "Status", dataIndex: "status", key: "status", ...getColumnSearchProps("status") },
    { title: "Vehicle", dataIndex: "vehicle", key: "vehicle", ...getColumnSearchProps("vehicle") },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Services",
      dataIndex: "services",
      key: "services",
      render: (services: AppointmentService[]) =>
        services.map((s) => `${s.serviceName} (${s.totalPrice} VND)`).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleAccept(record.appointmentId)}>
            Accept
          </Button>
          <Button
  type="primary"
  danger
  onClick={() => {
    setRejectModalVisible(true);
    setSelectedAppointmentId(record.appointmentId);
  }}
>
  Reject
</Button>

        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4">Danh sách cuộc hẹn</div>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
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
    </div>
  );
};

export default WorkVolumePage;
