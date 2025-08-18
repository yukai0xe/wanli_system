import React, { useState, useEffect } from "react";
import EditableTable from "@/app/components/table/editTable";
import { personalIteamListFakeData } from "@/lib/viewModel/tableData";
import {
  HiEllipsisHorizontal,
  HiSquaresPlus,
  HiArrowDownTray,
} from "react-icons/hi2";

type RowData = {
  id: number;
  [key: string]: number | string | boolean | undefined;
};

type RowHeader = {
  key: string;
  label: string;
  type: InputObject;
  validate: (v: string) => boolean;
};

type groupDataType = Record<string, { data: RowData[]; isOpen: boolean }>;

const TeamMemberTable: React.FC<{
  rowsProp: RowHeader[];
  dataProp: RowData[];
}> = ({ rowsProp, dataProp }) => {
  const [q, setQ] = useState("");
  const [groupData, setGroupData] = useState<groupDataType>({});

  const { keyOrder } = personalIteamListFakeData;

  const sortHeaderRule = (data: RowHeader[]) => {
    return keyOrder
      .map((key) => data.find((h) => h.key === key))
      .filter((h): h is RowHeader => !!h);
  };
  const sortDataRule = (data: RowData[]) => {
    return data.map((row) => {
      const sortedRow: RowData = { id: row.id };
      keyOrder.forEach((key) => {
        if (key in row) sortedRow[key] = row[key];
      });
      return sortedRow;
    });
  };

  const rowsSortingProp = sortHeaderRule(rowsProp);
  const dataSortingProp = sortDataRule(dataProp);
  const [showBtn, setShowBtn] = useState<boolean>(false);

  useEffect(() => {
    const gdata: groupDataType = {};
    dataSortingProp.forEach((data) => {
      if ("type" in data) {
        const { type } = data;
        if (typeof type === "string") {
          if (!(type in gdata)) {
            gdata[type] = {
              data: [],
              isOpen: true,
            };
          }
          gdata[type].data.push(data);
        }
      }
    });
    setGroupData(gdata);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <h1 className="text-xl font-semibold tracking-tight">使用者清單</h1> */}
          <div className="mt-4 text-xs text-gray-500">
            提示：點左側「編輯」可對單列進行修改，完成後按「儲存」或「取消」。
          </div>
          <div className="w-2/3 flex items-center justify-end gap-2">
            <div className="flex gap-x-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜尋裝備名稱"
                className="w-64 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400 focus:outline-none focus:ring-0"
              />
              <div className="relative">
                <HiEllipsisHorizontal
                  className={`size-8 cursor-pointer hover:bg-gray-100 rounded ${
                    showBtn && "bg-gray-200"
                  }`}
                  onClick={() => setShowBtn(!showBtn)}
                />
                {showBtn && (
                  <div className="absolute top-10 right-0 flex flex-col gap-2 text-left w-64 bg-white rounded shadow-2xl">
                    <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                      <HiSquaresPlus className="size-6 hover:text-slate-700 transition" />
                      新增裝備
                    </button>
                    <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                      <HiArrowDownTray className="size-6 hover:text-slate-700 transition" />
                      匯出裝備清單 (.pdf)
                    </button>
                    <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                      <HiArrowDownTray className="size-6 hover:text-slate-700 transition" />
                      匯出裝備清單 (.docs)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {Object.entries(groupData).map(([key, object], idx) => {
          return (
            <div key={idx} className="mb-5">
              <h3 className="text-xl pb-2">
                {key}
                <span
                  onClick={() => {
                    setGroupData({
                      ...groupData,
                      [key]: {
                        ...object,
                        isOpen: !object.isOpen,
                      },
                    });
                  }}
                  className="cursor-pointer"
                >
                  {" "}
                  {object.isOpen ? "▲" : "▼"}
                </span>
              </h3>
              {object.isOpen && (
                <EditableTable
                  rowsSortingProp={rowsSortingProp}
                  dataSortingProp={object.data}
                  q={q}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamMemberTable;
