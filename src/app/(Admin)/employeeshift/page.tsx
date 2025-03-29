/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Input as AntInput,
  Space,
  Table,
  Button,
  message,
  Tag,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axiosInstance from "@/dbUtils/axios";

interface ShiftData {
  shiftId: number;
  startTime: string;
  endTime: string;
  employeeShifts: any[];
}

interface DataType {
  key: string;
  employeeShiftId: number;
  employeeId: number;
  shiftId: number;
  month: number;
  shift: ShiftData;
}

type DataIndex = keyof DataType;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EmployeeShiftManagementPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState<DataType | null>(null);

  const searchInput = useRef<InputRef>(null);

  // Fetch employee shift data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("employee/employee-shift");
        console.log(response);
        const shifts = response.data.map((item: any) => ({
          key: item.employeeShiftId.toString(),
          employeeShiftId: item.employeeShiftId,
          employeeId: item.employeeId,
          shiftId: item.shiftId,
          month: item.month,
          shift: item.shift,
        }));
        setData(shifts);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch employee shifts.");
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

  const handleViewDetail = (record: DataType) => {
    setSelectedShift(record);
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
    onFilter: (value, record) => {
      if (record[dataIndex]) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      }
      return false;
    },
  });

  // Format the time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate shift duration in hours
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    let durationMinutes = endTotalMinutes - startTotalMinutes;
    // Handle shifts that cross midnight
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  const columns: ColumnsType<DataType> = [
    
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (month) => monthNames[month - 1], // Convert month number to name (1-indexed)
      sorter: (a, b) => a.month - b.month,
      filters: Array.from({ length: 12 }, (_, i) => ({
        text: monthNames[i],
        value: i + 1,
      })),
      onFilter: (value, record) => record.month === value,
    },
    {
      title: "Shift Time",
      key: "shiftTime",
      render: (_, record) => (
        <span>
          {formatTime(record.shift.startTime)} - {formatTime(record.shift.endTime)}
        </span>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <Tag color="blue">
          {calculateDuration(record.shift.startTime, record.shift.endTime)}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<ClockCircleOutlined />}
            type="default"
            onClick={() => handleViewDetail(record)}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4">Employee Shift </div>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Detail Modal */}
      <Modal
        title={`Shift Details #${selectedShift?.employeeShiftId}`}
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
        width={600}
      >
        {selectedShift && (
          <div className="shift-detail-container">
            {/* Shift Information */}
            <Descriptions title="Shift Information" bordered column={1}>
              <Descriptions.Item label="Employee Shift ID">
                {selectedShift.employeeShiftId}
              </Descriptions.Item>
              <Descriptions.Item label="Shift ID">
                {selectedShift.shiftId}
              </Descriptions.Item>
              <Descriptions.Item label="Month">
                {monthNames[selectedShift.month - 1]} ({selectedShift.month})
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <h3 className="text-lg font-semibold mb-3">Schedule Details</h3>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Start Time">
                {formatTime(selectedShift.shift.startTime)}
              </Descriptions.Item>
              <Descriptions.Item label="End Time">
                {formatTime(selectedShift.shift.endTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Shift Duration">
                <Tag color="blue">
                  {calculateDuration(selectedShift.shift.startTime, selectedShift.shift.endTime)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeShiftManagementPage;