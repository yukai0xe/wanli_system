import React, { useState, useEffect } from "react";
import EditableTable from "@/app/components/table/editTable";
import { personalIteamListFakeData as pItemfake, teamItemListFakeData as tItemfake } from "@/lib/viewModel/tableData";
import {
  HiEllipsisHorizontal,
  HiSquaresPlus,
  HiArrowDownTray,
} from "react-icons/hi2";
import { AddNewItem } from "@/app/components/dialog/ItemDialog";
import { useRouter } from "next/navigation";
import { usePlanTeamStore } from "@/state/planTeamStore";


const keyOrder = [...new Set([...pItemfake.keyOrder, ...tItemfake.keyOrder])];
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

const TeamMemberTable: React.FC<{
  isTeam?: boolean
  rowsProp: RowHeader[];
  dataProp: RowData[];
  feature: {
    addNewItems: () => void,
    exportItemsAsDocs: () => void
  }
}> = ({ rowsProp, dataProp, feature, isTeam=false }) => {
  const [q, setQ] = useState("");
  const [groupData, setGroupData] = useState<groupData>({});
  const rowsSortingProp = sortHeaderRule(rowsProp);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const teamId = usePlanTeamStore((state) => state.id);

  useEffect(() => {
    const sortedData = sortDataRule(dataProp);
    const gdata: groupData = {};
    sortedData.forEach((data) => {
      if ("type" in data && typeof data.type === "string") {
        if (!(data.type in gdata)) {
          gdata[data.type] = { data: [], isOpen: true };
        }
        gdata[data.type].data.push(data);
      }
    });

    setGroupData(gdata);
  }, [dataProp]);

  const openHandler = () => {
    setShowBtn(false);
    setOpen(true);
  }
  const closeHandler = () => {
    setOpen(false);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <h1 className="text-xl font-semibold tracking-tight">使用者清單</h1> */}
          <div className="w-1/2 flex items-end gap-x-2">
            {isTeam && (
              <button
                className="px-3 py-1 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
                onClick={() => router.push(`/admin/myTeam/${teamId}/finalCheck/allocation`)}
              >
                公裝分配
              </button>
            )}
            <div className="mt-4 text-xs text-gray-500">
              提示：點右側「三個點的符號」可以新增裝備
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-end gap-3">
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
                    <button
                      className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                      onClick={openHandler}
                    >
                      <HiSquaresPlus className="size-6 hover:text-slate-700 transition" />
                      新增裝備
                    </button>
                    <button
                      className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                      onClick={feature.exportItemsAsDocs}
                    >
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
              <div className="flex justify-end">
                {rowsSortingProp.map((r) =>
                  r.calc
                    ? r.calc.map((v) => (
                        <span
                          key={`${idx}-${key}`}
                          className="text-sm text-gray-600"
                        >
                          {v.label}: {v.f(object.data)}
                        </span>
                      ))
                    : null
                )}
              </div>
            </div>
          );
        })}
      </div>
      {open && (
        <AddNewItem
          open={open}
          isTeam={isTeam}
          handleClose={closeHandler}
          handleConfirm={feature.addNewItems}
        />
      )}
    </div>
  );
};

export default TeamMemberTable;
