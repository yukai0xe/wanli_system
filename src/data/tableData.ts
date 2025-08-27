import { parseEnumKey } from "@/lib/utility";
import { Gender } from "@/types/enum";

export const teamMemberFakeData: {rowsHeader: EditableRowHeader[], rowsData: RowData[], keyOrder: string[]} = {
    rowsHeader: [
    {
    key: "studentNumber",
    label: "學號",
    type: {
        type: "text"
    },
    edit: true,
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
    edit: false,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
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
    edit: true,
    validate: (v: string) => {
      if (!v) {
        alert("地址不能為空或空白");
        return false;
      }
      return true;
    },
   },
    ],
    rowsData: [],
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

export const personalIteamListFakeData: { rowsHeader: EditableRowHeader[], rowsData: RowData[], keyOrder: string[] } = {
  rowsHeader: [
    {
      key: "type",
      label: "種類",
      type: { type: "text" },
      edit: true,
      validate: (v: string) => v.length > 0,
    },
    {
      key: "name",
      label: "裝備名稱",
      edit: false,
      type: { type: "text" },
      validate: (v: string) => v.length > 0,
    },
    {
      key: "required",
      label: "是否必要",
      edit: true,
      type: { type: "checkbox" },
      validate: (v: string) => ["true", "false"].includes(v),
    },
    {
      key: "weight",
      label: "重量(克)",
      edit: false,
      type: { type: "number" },
      validate: (v: string) => !isNaN(Number(v)) && Number(v) >= 0,
    },
    {
      key: "quantity",
      label: "數量",
      edit: true,
      type: { type: "text" },
      validate: (v: string) => v == "適量" || (!isNaN(Number(v)) && Number(v) >= 0)
    },
  ],
  rowsData: [],
  keyOrder: [
    "type",
    "required",
    "name",
    "weight",
    "quantity"
  ]
}

export const teamItemListFakeData: { rowsHeader: EditableRowHeader[], rowsData: RowData[], keyOrder: string[] } = {
  rowsHeader: [
    {
      key: "type",
      label: "種類",
      edit: true,
      type: { type: "text" },
      validate: (v: string) => v.length > 0,
    },
    {
      key: "name",
      label: "裝備名稱",
      edit: false,
      type: { type: "text" },
      validate: (v: string) => v.length > 0,
    },
    {
      key: "quantity",
      label: "數量",
      edit: true,
      type: { type: "number" },
      validate: (v: string) => !isNaN(Number(v)) && Number(v) >= 0,
    },
    {
      key: "weight",
      label: "重量(克)",
      edit: false,
      type: { type: "number" },
      calc: [
          {
            label: "總重量",
          fn: (data: { weight: string; quantity: string; }[]) => {
              console.log(data);
              return data.reduce((sum, row) => {
                const weight = Number(row.weight || 0);
                const quantity = isNaN(Number(row.quantity)) ? 1 : Number(row.quantity);
                return sum + weight * quantity;
              }, 0).toString() + "g";
            }
          }
        ],
      validate: (v: string) => !isNaN(Number(v)) && Number(v) >= 0,
    },
  ],
  rowsData: [],
  keyOrder: [
    "type",
    "name",
    "quantity",
    "weight"
  ]
}
