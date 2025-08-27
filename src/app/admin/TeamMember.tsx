import React, { useEffect, useState } from "react";
import EditableTable from "../components/table/editTable";
import { teamMemberFakeData } from "@/data/tableData";
import { AddNewTeamMember } from "@/app/components/dialog/TeamMemberDialog";
import {
  HiEllipsisHorizontal,
  HiMiniUserPlus,
  HiDocumentPlus,
  HiArrowDownTray,
} from "react-icons/hi2";

const { keyOrder } = teamMemberFakeData;
const sortHeaderRule = (data: EditableRowHeader[]) => {
  return keyOrder
    .map((key) => data.find((h) => h.key === key))
    .filter((h): h is EditableRowHeader => !!h);
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

const TeamMemberTable: React.FC<{
  rowsProp: EditableRowHeader[],
  dataProp: RowData[],
  feature: {
    addNewMember: () => void,
    importNewMembers: () => void,
    downloadExample: () => void,
    exportMembersAsExcel: () => void
  }
  allTeamMember?: boolean
}> = ({ rowsProp, dataProp, feature, allTeamMember = false }) => {
  
    const rowsSortingProp = sortHeaderRule(rowsProp);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, ] = useState<boolean>(false);
    const [dataSortingProp, setDataSortingProp] = useState(sortDataRule(dataProp));
    const [q, setQ] = useState("");
    const [isOpen, setIsOpen] = useState([true, true]);
    const [showBtn, setShowBtn] = useState<boolean>(false);
    const filterLeader = (data: RowData) => {
      if (Object.keys(data).includes("isLeader")) return data["isLeader"];
      return false;
    }
    const closeHandler = () => {
      setOpen(false);
    };

    const openHandler = () => {
      setOpen(true);
      setShowBtn(false);
    };
    
    useEffect(() => {
      setDataSortingProp(sortDataRule(dataProp));
    }, [dataProp])

    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="relative min-h-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* <h1 className="text-xl font-semibold tracking-tight">使用者清單</h1> */}
            <div className="mt-4 text-xs text-gray-500">
              提示：點右側「三個點的符號」可以新增人員
            </div>
            <div className="w-2/3 flex items-center justify-end gap-2">
              <div className="flex items-center gap-x-3">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="搜尋名稱 / Email / 角色"
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
                      <button
                        className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                        onClick={openHandler}
                      >
                        <HiMiniUserPlus className="size-6 hover:text-slate-700 transition" />
                        新增人員
                      </button>
                      <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                        <HiDocumentPlus className="size-6 hover:text-slate-700 transition" />
                        匯入人員名單
                      </button>
                      <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                        <HiArrowDownTray className="size-6 hover:text-slate-700 transition" />
                        下載範例檔案
                      </button>
                      <button className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition">
                        <HiArrowDownTray className="size-6 hover:text-slate-700 transition" />
                        匯出人員名單 (.xlsx)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded">
              <div className="flex flex-col items-center">
                <div className="loader mb-2"></div>
                <p className="text-gray-600 text-sm">資料加載中...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h3>
                  幹部 {allTeamMember && "(所有幹部)"}{" "}
                  <span
                    onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}
                    className="cursor-pointer"
                  >
                    {isOpen[0] ? "▲" : "▼"}
                  </span>
                </h3>
                {isOpen[0] && (
                  <EditableTable
                    rowsSortingProp={rowsSortingProp}
                    dataSortingProp={dataSortingProp.filter((d) =>
                      filterLeader(d)
                    )}
                    onDataChange={() => {}}
                    q={q}
                  />
                )}
              </div>

              <div className="mb-5">
                <h3>
                  一般隊員 {allTeamMember && "(包含過去隊員)"}{" "}
                  <span
                    onClick={() => setIsOpen([isOpen[0], !isOpen[1]])}
                    className="cursor-pointer"
                  >
                    {isOpen[1] ? "▲" : "▼"}
                  </span>
                </h3>
                {isOpen[1] && (
                  <EditableTable
                    rowsSortingProp={rowsSortingProp}
                    dataSortingProp={dataSortingProp.filter(
                      (d) => !filterLeader(d)
                    )}
                    onDataChange={() => {}}
                    q={q}
                  />
                )}
              </div>
              {isOpen && (
                <AddNewTeamMember
                  open={open}
                  handleClose={closeHandler}
                  handleConfirm={feature.addNewMember}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
}

export default TeamMemberTable;