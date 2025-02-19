"use client";

import { useRef, useState } from "react";
import { Button, Input as AntInput, Space, Table, DatePicker } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  key: string;
  stt: number;
  sohopdong: string;
  sodonhang: number;
  nhathauphu: string;
  duan: string;
  ngaytaobangkhoiluong: string;
  tengoithau: string;
  trangthai: string;
  phienbandaduyet: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: "1",
    stt: 1,
    sohopdong: "CN24-01/TP/24/3899",
    sodonhang: 4600006325,
    nhathauphu: "102092 CTY BẢO HIỂM PVI PHÍA NAM",
    duan: "CN24-01 DỰ ÁN PHÁT TRIỂN C.NGHIỆP YÊN PHONG BWID",
    ngaytaobangkhoiluong: "",
    tengoithau: "CN24-01.01 Gói nhà kho, hạ tầng, cơ điện",
    trangthai: "Đang thực hiện",
    phienbandaduyet: "",
  },
  {
    key: "2",
    stt: 2,
    sohopdong: "CN22-18/TP/23/884",
    sodonhang: 4600005503,
    nhathauphu:
      "110417 CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ VẬT LIỆU XÂY DỰNG THIÊN LƯƠNG",
    duan: "CN22-18 VINFAST-TỔ HỢP SẢN XUẤT Ô TÔ, XE MÁY-GÐ3",
    ngaytaobangkhoiluong: "22/07/2024",
    tengoithau: "CN22-18.02 Gói thầu XD",
    trangthai: "Đang thực hiện",
    phienbandaduyet: "",
  },
  {
    key: "3",
    stt: 3,
    sohopdong: "CS22-10/TP/22/1815",
    sodonhang: 4500002944,
    nhathauphu: "108864 CÔNG TY CỔ PHẦN KIẾN TRÚC - XÂY DỰNG XANH BABYLON",
    duan: "CS22-10 CHARM RESORT HO TRAM",
    ngaytaobangkhoiluong: "12/09/2024",
    tengoithau: "CS22-10.02 Gói thầu",
    trangthai: "Đang thực hiện",
    phienbandaduyet: "",
  },
  {
    key: "4",
    stt: 4,
    sohopdong: "C.18.049-02/TP/024",
    sodonhang: 4600005561,
    nhathauphu: "101680 CÔNG TY TNHH ĐẦU TƯ RDC",
    duan: "CS20-06 VINHOMES GRAND PARK Q9-PK1 PK2 PK3 TTTM",
    ngaytaobangkhoiluong: "23/07/2024",
    tengoithau: "CS20-06.02 Gói thầu PK1",
    trangthai: "",
    phienbandaduyet: "",
  },
];

const WorkVolumePage = () => {
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
          <Button type="primary" onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<DataType> = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Số hợp đồng", dataIndex: "sohopdong", key: "sohopdong" },
    { title: "Số đơn hàng", dataIndex: "sodonhang", key: "sodonhang", ...getColumnSearchProps("sodonhang"), sorter: (a, b) => a.sodonhang - b.sodonhang },
    { title: "Nhà thầu phụ", dataIndex: "nhathauphu", key: "nhathauphu", ...getColumnSearchProps("nhathauphu") },
    { title: "Dự án", dataIndex: "duan", key: "duan", ...getColumnSearchProps("duan") },
    { title: "Ngày tạo bảng khối lượng", dataIndex: "ngaytaobangkhoiluong", key: "ngaytaobangkhoiluong" },
    { title: "Tên gói thầu", dataIndex: "tengoithau", key: "tengoithau", ...getColumnSearchProps("tengoithau") },
    { title: "Trạng thái", dataIndex: "trangthai", key: "trangthai" },
    { title: "Phiên bản đã duyệt", dataIndex: "phienbandaduyet", key: "phienbandaduyet" },
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-4">Danh sách bảng khối lượng</div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <AntInput prefix={<SearchOutlined />} placeholder="Enter Contract No. Ref, subcontractor,..." style={{ border: "none", backgroundColor: "transparent" }} />
      </Space>
      <Table<DataType> columns={columns} dataSource={data} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
    </div>
  );
};

export default WorkVolumePage;
