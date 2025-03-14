"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, message } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axiosInstance from "@/dbUtils/axios";
import { getReports } from "@/dbUtils/ManagerAPIs/reportservice";
// API function to get reports

interface Report {
  key: string;
  reportId: number;
  problem: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  customerId: number;
  customerName: string;
}

type DataIndex = keyof Report;

const ReportManagementPage = () => {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getReports();

      // Transform the API response to match the table structure
      const formattedReports = response.data.map((item: any) => ({
        key: item.reportId.toString(),
        reportId: item.reportId,
        problem: item.problem,
        title: item.title,
        description: item.description,
        createdAt: formatDate(item.createdAt),
        updatedAt: formatDate(item.updatedAt),
        customerId: item.customerId,
        customerName: item.customerName,
      }));

      setData(formattedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      message.error("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
  ): TableColumnType<Report> => ({
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

  const columns: ColumnsType<Report> = [
    {
      title: "ID",
      dataIndex: "reportId",
      key: "reportId",
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      width: 150,
    },
    {
      title: "Problem",
      dataIndex: "problem",
      key: "problem",
      ...getColumnSearchProps("problem"),
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
      width: 150,
    },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4 flex justify-between items-center">
        <div className="text-xl font-semibold mb-4">Report Management</div>
      </div>
      <Table<Report>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ReportManagementPage;