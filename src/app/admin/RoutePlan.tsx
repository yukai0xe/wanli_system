"use client";
import { LuMapPinPlus } from "react-icons/lu";
import { numberToChinese, timeToMinutes, minutesToTime } from "@/lib/utility";
import React, { useEffect, useState, useRef } from "react";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useRouter } from "next/navigation";
import TrackLink from "@/app/components/TrackLink";
import { useRouteStore } from "@/state/routeStore";
import {
  HiEllipsisHorizontal,
} from "react-icons/hi2";
import { FaFileInvoice } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa6";
import { emptyDateRoute } from "@/data/routeData";
import { v7 as uuidv7 } from "uuid";
import dayjs from "dayjs";

const fields = ["point", "arrive", "rest", "depart", "duration", "note"] as const;

type EditCell = {
    field: keyof RecordPoint;
    date: string;
    pointId: string;
    routeId: string;
};

type FocusCell = {
    field: Exclude<keyof RecordPoint, "id">;
    date: string;
    rowIdx: number;
};

const RouteTable: React.FC<{
  data: Route[];
  setData: (routes: Route[]) => void;
  activeTab: number;
}> = ({ data, setData, activeTab }) => {
    const _handleTimeChange = useRouteStore(state => state.handleTimeChange);
    const [editing, setEditing] = useState<EditCell | null>(null);
    const [focus, setFocus] = useState<FocusCell | null>(null);
    const [prevValue, setPrevValue] = useState<string | number>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddRow = (date: string) => {
        const newData = data.map((route) => {
            const { id, days } = route;
            const newRoute: Route = {id, days: {}};
            for (const date in days) {
                newRoute.days[date] = route.days[date].map((r) => ({ ...r }));
            }
            return newRoute;
        });
        const route = { ...newData[activeTab] };
        const rows = [...(route.days[date] || [])];
        if (rows.length > 0) {
            const lastRow = data[activeTab].days[date][rows.length - 1];
            const time =
            lastRow.arrive.length > 0
                ? minutesToTime(timeToMinutes(lastRow.arrive) + lastRow.rest)
                : "";
            rows.push({
            id: uuidv7(),
            point: "",
            depart: time,
            arrive: time,
            duration: 0,
            rest: 0,
            note: "",
            });
        } else {
            rows.push({
            id: uuidv7(),
            point: "",
            depart: "12:00",
            arrive: "12:00",
            duration: 0,
            rest: 0,
            note: "",
            });
        }

        route.days[date] = rows;
        newData[activeTab] = route;
        setData(newData);
    };

  const handleDeleteRow = (date: string, rowIdx: number) => {
    const newData = data.map((route) => {
      const { id, days } = route;
      const newRoute: Route = { id, days: {} };
      for (const date in days) {
        newRoute.days[date] = route.days[date].map((r) => ({ ...r }));
      }
      return newRoute;
    });
    const route = { ...newData[activeTab] };
    const rows = [...(route.days[date] || [])];
    rows.splice(rowIdx, 1);
    if (rowIdx > 0) {
      for (let i = rowIdx; i < rows.length; i++) {
        rows[i].arrive = minutesToTime(
          timeToMinutes(rows[i - 1].depart) + rows[i - 1].duration
        );
        rows[i].depart = minutesToTime(
          timeToMinutes(rows[i].arrive) + rows[i].rest
        );
      }
    }
    route.days[date] = rows;
    newData[activeTab] = route;
    setData(newData);
  };

  const handleInputValidation = (field: string, value: string) => {
    if (field === "depart" || field === "arrive") {
      // 檢查時間格式 HH:mm
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(value)) {
        alert("時間格式錯誤，請輸入 HH:mm，例如 08:00");
        return false;
      }
    }

    if (field === "duration" || field === "rest") {
      // 檢查整數
      const intVal = Number(value);
      if (!Number.isInteger(intVal) || intVal < 0) {
        alert("請輸入正整數");
        return false;
      }
    }

    return true;
  };

  const handleTimeChange = (cell: EditCell, newValue: string | number) => {
      if (!handleInputValidation(cell.field, newValue.toString())) return;
      _handleTimeChange(cell, newValue);
  };

  const checkEditing = (
    pointId: string,
    field: Exclude<keyof RecordPoint, "id">,
    date: string
  ) => {
    return (
      editing?.pointId === pointId &&
      editing?.field === field &&
      editing?.date === date
    );
  };

  const checkFocus = (
    rowIdx: number,
    field: Exclude<keyof RecordPoint, "id">,
    date: string
  ) => {
    return (
      focus?.rowIdx === rowIdx && focus?.field === field && focus?.date === date
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!focus) return;
        let nextRow = focus.rowIdx;
        let nextField = focus.field;
        const row_count = data[activeTab].days[focus.date].length;

        if ((e.key === "Escape" || e.key === "Enter") && editing !== null) {
            if (inputRef.current) handleTimeChange(editing, inputRef.current?.value);
            setEditing(null);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            nextRow = (focus.rowIdx + 1) % row_count;
            setFocus({ ...focus, rowIdx: nextRow, field: nextField });
        }
        
        if (editing !== null) return;
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                nextRow = (focus.rowIdx - 1 + row_count) % row_count;
                break;
            case "ArrowDown":
                e.preventDefault();
                nextRow = (focus.rowIdx + 1) % row_count;
                break;
            case "ArrowLeft": {
                e.preventDefault();
                const idx = fields.indexOf(focus.field);
                nextField = fields[(idx - 1 + fields.length) % fields.length];
                break;
            }
            case "ArrowRight": {
                e.preventDefault();
                const idx = fields.indexOf(focus.field);
                nextField = fields[(idx + 1) % fields.length];
                break;
            }
        }

        setFocus({ ...focus, rowIdx: nextRow, field: nextField });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("tr")) {
        setFocus(null);
        setEditing(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 mt-4">
      {Object.entries(data[activeTab].days || {}).map(([date, rows]) => (
        <div key={date} className="space-y-2">
          <div className="flex gap-x-3 items-center">
            <LuMapPinPlus
              title="新增記錄點"
              className="cursor-pointer size-8 p-1 rounded-2xl hover:bg-blue-100"
              onClick={() => handleAddRow(date)}
            />
            <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
          </div>
          <div className="overflow-x-auto shadow table-wrapper">
            <table className="min-w-full table-fixed border border-gray-200 text-sm">
              {/* 設定欄位比例 */}
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[7%]" />
                <col className="w-[7%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
                <col className="w-[55%]" />
              </colgroup>

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 border">記錄點</th>
                  <th className="px-4 py-2 border">抵達時間</th>
                  <th className="px-4 py-2 border">休息時間(分鐘)</th>
                  <th className="px-4 py-2 border">出發時間</th>
                  <th className="px-4 py-2 border">行進時間(分鐘)</th>
                  <th className="px-4 py-2 border">備註</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-300"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (confirm("確定要刪除此列嗎？")) {
                        handleDeleteRow(date, rowIdx);
                      }
                    }}
                  >
                    {fields.map((field) => {
                      const isStrike =
                        (rowIdx === 0 &&
                          (field === "arrive" || field === "rest")) ||
                        (rowIdx === rows.length - 1 &&
                          (field === "depart" ||
                            field === "rest" ||
                            field === "duration"));
                      if (isStrike) {
                        return (
                          <td
                            key={date + "-" + field}
                            className={`px-4 py-2 border cursor-pointer h-[35px] relative ${
                              checkFocus(rowIdx, field, date)
                                ? "border-blue-500 border-2"
                                : "border"
                            }`}
                            onClick={() => {
                              setEditing(null);
                              setFocus({ rowIdx, field, date });
                            }}
                          >
                            x
                          </td>
                        );
                      }
                      return (
                        <td
                          key={date + "-" + field}
                          className={`px-4 py-2 cursor-pointer h-[35px] ${
                            checkFocus(rowIdx, field, date)
                              ? "border-blue-500 border-2"
                              : "border"
                          }`}
                          onDoubleClick={() => {
                            if (
                              editing !== null &&
                              prevValue.toString().length > 0
                            ) {
                              handleTimeChange(editing, prevValue);
                            }
                            setFocus({
                              rowIdx,
                              field,
                              date,
                            });
                            setEditing({
                              pointId: row.id,
                              routeId: data[activeTab].id,
                              field,
                              date,
                            });
                            setPrevValue(row[field]);
                          }}
                          onClick={(e) => {
                            if (e.detail === 2) return;
                            if (
                              editing !== null &&
                              prevValue.toString().length > 0
                            ) {
                              handleTimeChange(editing, prevValue);
                            }
                            if (
                              checkFocus(rowIdx, field, date) &&
                              editing === null
                            ) {
                              setEditing({
                                pointId: row.id,
                                routeId: data[activeTab].id,
                                field,
                                date,
                              });
                              setPrevValue(row[field]);
                            } else {
                              setEditing(null);
                              setFocus({rowIdx, field, date });
                            }
                          }}
                        >
                          {checkEditing(row.id, field, date) ? (
                            <input
                              ref={inputRef}
                              type="text"
                              autoFocus
                              value={prevValue}
                              onChange={(e) =>
                                setPrevValue(e.currentTarget.value)
                              }
                              className="w-full h-full bg-transparent border-none outline-none px-0 py-0 text-sm"
                            />
                          ) : (
                            row[field]
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const DateDialog: React.FC<{
    currentArrive?: string
    currentDepart?: string
    confirmHandler: (arrive: string, depart: string) => void;
    cancelHandler: () => void;
}> = ({ currentArrive, currentDepart, confirmHandler, cancelHandler }) => {
    const [tempDeparture, setTempDeparture] = useState(currentDepart || "");
    const [tempArrival, setTempArrival] = useState(currentArrive || "");
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
          <h2 className="text-lg font-bold mb-4">修改時間</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">開始時間</label>
              <input
                type="date"
                value={tempDeparture}
                onChange={(e) => setTempDeparture(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">結束時間</label>
              <input
                type="date"
                value={tempArrival}
                onChange={(e) => setTempArrival(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => cancelHandler()}
              className="px-3 py-1 rounded border"
            >
              取消
            </button>
            <button
              onClick={() => confirmHandler(tempArrival, tempDeparture)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    );
}

const RoutePlanPage = () => {
    const { setRoutes, routes} = useRouteStore();
    const [tabs, setTabs] = useState(["預計行程"]);
    const [activeTab, setActiveTab] = useState<number>(0);
    const teamId = usePlanTeamStore(state => state.id);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    const saveTime = (tempArrival: string, tempDeparture: string) => {
      const newData = routes.map((route) => {
        const { id, days } = route;
        const newRoute: Route = { id, days: {} };
        for (const date in days) {
          newRoute.days[date] = route.days[date].map((r) => ({ ...r }));
        }
        return newRoute;
      });

      const diffTime =
        new Date(tempArrival).getTime() - new Date(tempDeparture).getTime();
      if (diffTime < 0) return;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      let currentDate = tempDeparture;

      if (activeTab === routes.length) {
        newData.push({id: uuidv7(), days: {}});
        for (let i = 0; i < diffDays; i++) {
          newData[activeTab].days[currentDate] = emptyDateRoute;
          const dateObj = new Date(currentDate);
          dateObj.setDate(dateObj.getDate() + 1);
          currentDate = dateObj.toISOString().split("T")[0];
        }
      } else {
        newData[activeTab] = { id: uuidv7(), days: {} };
        const oldDates = Object.keys(routes[activeTab]);
        for (let i = 0; i < diffDays; i++) {
            if (oldDates.includes(currentDate))
                newData[activeTab].days[currentDate] = routes[activeTab].days[currentDate];
            else newData[activeTab].days[currentDate] = emptyDateRoute;
            const dateObj = new Date(currentDate);
            dateObj.setDate(dateObj.getDate() + 1);
            currentDate = dateObj.toISOString().split("T")[0];
        }
      }
      setRoutes(newData);
      setIsModalOpen(false);
    };

    const cancelHandler = () => {
        if(activeTab === routes.length) setActiveTab(0);
        setIsModalOpen(false);
    }
    
    const handleAddRoute = () => {
        setActiveTab(tabs.length);
        openModal();
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const renderDialog = () => {
        if (activeTab >= routes.length) {
          return (
            <DateDialog
              currentDepart={dayjs().format("YYYY-MM-DD")}
              currentArrive={dayjs().format("YYYY-MM-DD")}
              confirmHandler={(arrive, depart) => saveTime(arrive, depart)}
              cancelHandler={() => cancelHandler()}
            />
          );
        } else {
          const dates = Object.keys(routes[activeTab]);
          return (
            <DateDialog
              currentDepart={dates[0]}
              currentArrive={dates[dates.length - 1]}
              confirmHandler={(arrive, depart) => saveTime(arrive, depart)}
              cancelHandler={() => cancelHandler()}
            />
          );
        }
    }

    const exportBackup = () => {
        const json = JSON.stringify(routes, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "routes.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const json: Route[] = JSON.parse(text);
          if (Array.isArray(json)) {
            setRoutes(json);
            alert("匯入成功！");
          } else {
            alert("JSON 格式錯誤：必須是 Route[]");
          }
        } catch (err) {
            if (err instanceof Error) alert("讀取或解析 JSON 失敗：" + err.message);
            else alert("讀取或解析 JSON 失敗：未知錯誤");
        }
      };
      reader.readAsText(file);
    };

    const deleteRoute = () => {
        if (activeTab === 0) return;
        const newData = routes.filter((_, idx) => idx !== activeTab);
        setRoutes(newData);
        if (activeTab >= newData.length) setActiveTab(newData.length - 1);
    }

    useEffect(() => {
        if (routes.length > 0) {
            const newTabs = ["預計行程"];
            for (let i = 1; i < routes.length; i++)
              newTabs.push("參考行程" + numberToChinese(i));
            setTabs(newTabs);
        }
    }, [routes]);

    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
        {/* Tab 切換列 */}
        <div className="flex pb-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className="px-6 py-2 rounded-2xl bg-yellow-400 text-stone-700 hover:bg-yellow-500 text-sm"
            >
              修改日期
            </button>
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition
              ${
                activeTab === idx
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => handleAddRoute()}
              className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 hover:bg-green-200 text-sm"
            >
              + 新增參考行程
            </button>
          </div>
          <div className="flex gap-x-2 items-center">
            <TrackLink
              url={`/admin/myTeam/${teamId}/finalCheck/routeCompare`}
              pageName="行程比較表"
              teamId={String(teamId)}
            >
              <button
                className="px-4 py-2 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
                onClick={() =>
                  router.push(`/admin/myTeam/${teamId}/finalCheck/routeCompare`)
                }
              >
                行程比較
              </button>
            </TrackLink>
            {activeTab !== 0 && (
              <button
                className="px-4 py-2 rounded bg-red-500 text-gray-50 hover:bg-red-600 transition"
                onClick={() => deleteRoute()}
              >
                刪除行程
              </button>
            )}
            <div className="relative">
              <HiEllipsisHorizontal
                className={`size-8 cursor-pointer hover:bg-gray-100 rounded ${
                  showBtn && "bg-gray-200"
                }`}
                onClick={() => setShowBtn(!showBtn)}
              />
              {showBtn && (
                <div className="absolute top-10 right-0 flex flex-col gap-2 text-left w-64 bg-white rounded shadow-2xl">
                  <label className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition cursor-pointer">
                    <FaFileImport className="size-6 hover:text-slate-700 transition" />
                    匯入備份檔
                    <input
                      type="file"
                      accept=".json"
                      onChange={importBackup}
                      className="hidden"
                    />
                  </label>
                  <button
                    className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                    onClick={exportBackup}
                  >
                    <FaFileInvoice className="size-6 hover:text-slate-700 transition" />
                    匯出備份檔
                  </button>
                  <button
                    className="inline-flex items-center gap-x-2 text-left hover:bg-gray-100 text-gray-800 px-4 py-3 transition"
                    onClick={() => {}}
                  >
                    <FaFileInvoice className="size-6 hover:text-slate-700 transition" />
                    匯出文件(docx)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          提示
          1：左鍵點擊表格即可編輯，右鍵點擊即可刪除，每個日期左邊的圖示可以新增紀錄點。
        </div>
        <div className="text-xs text-gray-500">
          提示
          2：修改「出發時間」、「抵達時間」、「行進時間」、「休息時間」都會自動計算整個行程的時間
        </div>
        <div className="text-xs text-gray-500">
          提示 3：每份行程要比較的紀錄點要相同名稱，不然無法成功比較
        </div>

        {/* 表格內容 */}
        <RouteTable data={routes} setData={setRoutes} activeTab={activeTab} />
        {/* Modal */}
        {isModalOpen && renderDialog()}
      </div>
    );
};

export default RoutePlanPage;
