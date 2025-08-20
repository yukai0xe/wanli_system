import { parseEnumKey } from "@/lib/utility";
import { Gender } from "@/types/enum";


type RowHeader = {
  key: string;
  label: string;
  type: InputObject;
  validate: (v: string) => boolean;
};

type RowData = {
  id: number;
  [key: string]: number | string | boolean | undefined;
};

export const teamMemberFakeData: {rowsHeader: RowHeader[], rowsData: RowData[], keyOrder: string[]} = {
    rowsHeader: [
    {
    key: "studentNumber",
    label: "學號",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!v) {
        alert("學號不能為空或空白");
        return false;
      }
      return true;
    },
  },
  {
    key: "name",
    label: "隊員姓名",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!v.trim()) {
        alert("隊員姓名不能為空或空白");
        return false;
      }
      return true;
    },
    },
  {
    key: "IDNumber",
    label: "身分證字號",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!/^[A-Z]\d{9}$/.test(v)) {
        alert("身分證格式不正確");
        return false;
      }
      return true;
    },
  },
  {
    key: "gender",
    label: "性別",
    type: {
        type: "select",
        value: [
            { label: "男", value: parseEnumKey(Gender, "男")?.toString() || "" },
            { label: "女", value: parseEnumKey(Gender, "女")?.toString() || "" }
        ]
    },
    validate: (v: string) => {
      if (!Object.keys(Gender).includes(v)) {
        alert("性別必須為男或女");
        return false;
      }
      return true;
    },
  },
  {
    key: "birth",
    label: "出生年月日",
    type: {
      type: "date"
    },
    validate: (v: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        alert("生日格式必須為 YYYY-MM-DD");
        return false;
      }
      return true;
    },
    },
  {
    key: "department",
    label: "系級",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!v.trim()) {
        alert("系級不能為空");
        return false;
      }
      return true;
    },
  },
  {
    key: "phone",
    label: "連絡電話",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!/^\d{8,10}$/.test(v)) {
        alert("電話格式不正確");
        return false;
      }
      return true;
    },
  },
  {
    key: "email",
    label: "信箱",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        alert("email 格式不正確");
        return false;
      }
      return true;
    },
  },
  {
    key: "emergencyContact",
    label: "緊急聯絡人",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!v.trim()) {
        alert("緊急聯絡人不能為空");
        return false;
      }
      return true;
    },
  },
  {
    key: "emergencyPhone",
    label: "緊急聯絡人電話",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!/^\d{8,10}$/.test(v)) {
        alert("緊急電話格式不正確");
        return false;
      }
      return true;
    },
  },
  {
    key: "address",
    label: "地址",
    type: {
        type: "text"
    },
    validate: (v: string) => {
      if (!v) {
        alert("地址不能為空或空白");
        return false;
      }
      return true;
    },
   },
    ],
    rowsData: [
        {
            id: 1,
            studentNumber: "S1001",
            name: "王小明",
            IDNumber: "A123456789",
            gender: parseEnumKey(Gender, Gender.Male)?.toString(),
            birth: "2000-01-15",
            department: "資工系 2 年級",
            phone: "0912345678",
            email: "xiaoming@example.com",
            emergencyContact: "王媽媽",
            emergencyPhone: "0987654321",
            isLeader: true,
            address: "台北市信義區信義路100號",
        },
        {
            id: 2,
            studentNumber: "S1002",
            name: "李小華",
            IDNumber: "B987654321",
            gender: parseEnumKey(Gender, Gender.Female)?.toString(),
            birth: "1999-05-20",
            department: "機械系 3 年級",
            phone: "0922333444",
            email: "xiaohua@example.com",
            emergencyContact: "李爸爸",
            emergencyPhone: "0911222333",
            isLeader: false,
            address: "新北市板橋區文化路200號",
        },
        {
            id: 3,
            studentNumber: "S1003",
            name: "陳大同",
            IDNumber: "C112233445",
            gender: parseEnumKey(Gender, Gender.Male)?.toString(),
            birth: "2001-08-10",
            department: "電機系 1 年級",
            phone: "0933444555",
            email: "datong@example.com",
            emergencyContact: "陳媽媽",
            emergencyPhone: "0966778899",
            isLeader: false,
            address: "台中市西屯區福雅路300號",
        },
        {
            id: 4,
            studentNumber: "S1004",
            name: "張美玲",
            IDNumber: "D556677889",
            gender: parseEnumKey(Gender, Gender.Female)?.toString(),
            birth: "2002-03-12",
            department: "外文系 1 年級",
            phone: "0955667788",
            email: "meiling@example.com",
            emergencyContact: "張爸爸",
            emergencyPhone: "0922113344",
            isLeader: true,
            address: "高雄市鼓山區龍德路50號",
        },
        {
            id: 5,
            studentNumber: "S1005",
            name: "黃志強",
            IDNumber: "E998877665",
            gender: parseEnumKey(Gender, Gender.Male)?.toString(),
            birth: "1998-11-25",
            department: "土木系 4 年級",
            phone: "0977889900",
            email: "zhiqiang@example.com",
            emergencyContact: "黃媽媽",
            emergencyPhone: "0933556677",
            isLeader: false,
            address: "台南市東區大學路1號",
        },
        {
            id: 6,
            studentNumber: "S1006",
            name: "林佳慧",
            IDNumber: "F334455667",
            gender: parseEnumKey(Gender, Gender.Female)?.toString(),
            birth: "2000-07-08",
            department: "護理系 3 年級",
            phone: "0911223344",
            email: "jiahui@example.com",
            emergencyContact: "林爸爸",
            emergencyPhone: "0977665544",
            isLeader: true,
            address: "新竹市東區光復路123號",
        },
        {
            id: 7,
            studentNumber: "S1007",
            name: "周文宏",
            IDNumber: "G776655443",
            gender: parseEnumKey(Gender, Gender.Male)?.toString(),
            birth: "1999-09-30",
            department: "法律系 2 年級",
            phone: "0933667788",
            email: "wenhong@example.com",
            emergencyContact: "周媽媽",
            emergencyPhone: "0911888777",
            isLeader: false,
            address: "宜蘭縣羅東鎮中山路88號",
        },
        {
            id: 8,
            studentNumber: "S1008",
            name: "許雅婷",
            IDNumber: "H445566778",
            gender: parseEnumKey(Gender, Gender.Female)?.toString(),
            birth: "2001-12-05",
            department: "商管系 1 年級",
            phone: "0966889900",
            email: "yating@example.com",
            emergencyContact: "許爸爸",
            emergencyPhone: "0922999888",
            isLeader: true,
            address: "嘉義市西區中正路77號",
        }
    ],
    keyOrder: [
      "id",
      "name",
      "IDNumber",
      "gender",
      "birth",
      "department",
      "studentNumber",
      "phone",
      "email",
      "emergencyContact",
      "emergencyPhone",
      "address",
      "isLeader"
    ]
}

export const personalIteamListFakeData: { rowsHeader: RowHeader[], rowsData: RowData[], keyOrder: string[] } = {
  rowsHeader: [
    {
      key: "type",
      label: "種類",
      type: { type: "text" },
      validate: (v: string) => v.length > 0,
    },
    {
      key: "name",
      label: "裝備名稱",
      type: { type: "text" },
      validate: (v: string) => v.length > 0,
    },
    {
      key: "important",
      label: "是否必要",
      type: { type: "checkbox" },
      validate: (v: string) => ["true", "false"].includes(v),
    },
  ],
  rowsData: [
    { id: 1, type: "服裝類", name: "保暖衣", important: "true" },
    { id: 2, type: "服裝類", name: "兩件式雨衣", important: "false" },
    { id: 3, type: "裝備類", name: "水壺", important: "true" },
    { id: 4, type: "裝備類", name: "頭燈", important: "false" },
    { id: 5, type: "其他", name: "個人藥品", important: "false" },
    { id: 6, type: "其他", name: "打火機", important: "false" },
  ],
  keyOrder: [
    "type",
    "important",
    "name"
  ]
}

