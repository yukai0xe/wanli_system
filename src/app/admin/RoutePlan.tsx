"use client";
import { LuMapPinPlus } from "react-icons/lu";
import { numberToChinese, uuidToNumericId, timeToMinutes, minutesToTime } from "@/lib/utility";
import { useEffect, useState } from "react";
import { routeData } from "@/data/routeData";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useRouter } from "next/navigation";
import TrackLink from "@/app/components/TrackLink";

const RoutePlanPage = () => {
  const [tabs, setTabs] = useState(["預計行程"]);
    const [activeTab, setActiveTab] = useState(0);
    const teamId = usePlanTeamStore(state => state.id);
    const router = useRouter();

  // 假資料：日期區分
  const [data, setData] = useState<Route[]>(routeData);
    
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [tempDeparture, setTempDeparture] = useState("");
     const [tempArrival, setTempArrival] = useState("");

    const openModal = () => {
        if (activeTab >= data.length) {
            setTempDeparture("");
            setTempArrival("");
        }
        else {
            const dates = Object.keys(data[activeTab]);
            setTempDeparture(dates[0]);
            setTempArrival(dates[dates.length - 1]);
        }
        setIsModalOpen(true);
     };

    const saveTime = () => {
        const newData = data.map((tab) => {
            const newTab: Route = {};
            for (const key in tab) {
                newTab[key] = [...tab[key]];
            }
            return newTab;
        });

        const diffTime = new Date(tempArrival).getTime() - new Date(tempDeparture).getTime(); 
        if (diffTime < 0) return;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        let currentDate = tempDeparture;

        if (activeTab == data.length) {
            newData.push({});
            for (let i = 0; i < diffDays; i++) {
              newData[activeTab][currentDate] = [];
              const dateObj = new Date(currentDate);
              dateObj.setDate(dateObj.getDate() + 1);
              currentDate = dateObj.toISOString().split("T")[0];
            }
        } 
        else {
            newData[activeTab] = {};
            const oldDates = Object.keys(data[activeTab]);
            for (let i = 0; i < diffDays; i++) {
                if (oldDates.includes(currentDate)) newData[activeTab][currentDate] = data[activeTab][currentDate];
                else newData[activeTab][currentDate] = [];
                const dateObj = new Date(currentDate);
                dateObj.setDate(dateObj.getDate() + 1);
                currentDate = dateObj.toISOString().split("T")[0];
            }
        } 
        setData(newData);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        if(activeTab === data.length) setActiveTab(0);
        setIsModalOpen(false);
    }
    
    
    useEffect(() => {
        if (data.length > 0) {
            setTabs(prev => {
                const newTabs = [...prev];
                for (let i = prev.length; i < data.length; i++)
                    newTabs.push("參考行程" + numberToChinese(i));
                return newTabs;
            })
        }
    }, [data.length])
    
    const [editing, setEditing] = useState<{
      row: number;
      field: string;
      date: string;
    } | null>(null);

    const handleAddRoute = () => {
        setActiveTab(tabs.length);
        openModal();
    }

    const handleAddRow = (date: string) => {
      setData((prev) => {
        const newData = prev.map((tab) => {
          const newTab: Route = {};
          for (const key in tab) {
            newTab[key] = tab[key].map((r) => ({ ...r }));
          }
          return newTab;
        });
        const tabData = { ...newData[activeTab] };
        const rows = [...(tabData[date] || [])];
        if (rows.length > 0) {
          const lastRow = data[activeTab][date][rows.length - 1];
        rows.push({
            id: uuidToNumericId(),
            point: "",
            depart: minutesToTime(timeToMinutes(lastRow.arrive) + lastRow.rest),
            arrive: minutesToTime(timeToMinutes(lastRow.arrive) + lastRow.rest),
            duration: 0,
            rest: 0,
            note: "",
          });
        } else {
        rows.push({
            id: uuidToNumericId(),
            point: "",
            depart: "12:00",
            arrive: "12:00",
            duration: 0,
            rest: 0,
            note: "",
          });
        }  
          
        tabData[date] = rows;
        newData[activeTab] = tabData;
        return newData;
      });
    };

    const handleDeleteRow = (date: string, rowIdx: number) => {
      setData((prev) => {
        const newData = prev.map((tab) => {
          const newTab: Route = {};
          for (const key in tab) {
            newTab[key] = tab[key].map((r) => ({ ...r }));
          }
          return newTab;
        });
        const tabData = { ...newData[activeTab] };
        const rows = [...(tabData[date] || [])];
        rows.splice(rowIdx, 1);
        if (rowIdx > 0) {
            for (let i = rowIdx; i < rows.length; i++) {
              rows[i].depart = minutesToTime(
                timeToMinutes(rows[i - 1].arrive) + rows[i - 1].rest
              );
              rows[i].arrive = minutesToTime(
                timeToMinutes(rows[i].depart) + rows[i].duration
              );
            }
        }
        tabData[date] = rows;
        newData[activeTab] = tabData;
        return newData;
      });
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

    const handleTimeChange = (
      date: string,
      rowIdx: number,
      field: string,
      newValue: string
    ) => {
    if (!handleInputValidation(field, newValue)) return;
    setData((prev) => {
        const newData = prev.map((tab) => {
          const newTab: Route = {};
           for (const key in tab) {
             newTab[key] = tab[key].map((r) => ({ ...r }));
           }
          return newTab;
        });
        const rows = newData[activeTab][date];
        const n = rows.length;

        switch (field) {
            case "depart":
                if (typeof newValue === "string") {
                const diff =
                    timeToMinutes(newValue) - timeToMinutes(rows[rowIdx].depart);
                rows.forEach((r) => {
                    r.depart = minutesToTime(timeToMinutes(r.depart) + diff);
                    r.arrive = minutesToTime(timeToMinutes(r.arrive) + diff);
                });
                }
                break;
            case "arrive":
                if (typeof newValue === "string") {
                const diff =
                    timeToMinutes(newValue) - timeToMinutes(rows[rowIdx].arrive);
                rows.forEach((r) => {
                    r.depart = minutesToTime(timeToMinutes(r.depart) + diff);
                    r.arrive = minutesToTime(timeToMinutes(r.arrive) + diff);
                });
                }
                break;
            case "duration":
                if (!isNaN(Number(newValue))) {
                    const delta = Number(newValue) - rows[rowIdx].duration;
                    for (let i = rowIdx; i < n - 1; i++) {
                        if(i === rowIdx) rows[i].duration += delta;
                        rows[i + 1].arrive = minutesToTime(
                            timeToMinutes(rows[i].depart) + rows[i].duration
                        );
                        rows[i + 1].depart = minutesToTime(
                          timeToMinutes(rows[i + 1].arrive) + rows[i + 1].rest
                        );
                    }
                }
                break;
            case "rest":
                if (!isNaN(Number(newValue))) {
                const delta = Number(newValue) - rows[rowIdx].rest;
                for (let i = rowIdx; i < n - 1; i++) {
                        if (i === rowIdx) rows[i].rest += delta;
                        rows[i].depart = minutesToTime(
                            timeToMinutes(rows[i].arrive) + rows[i].rest
                        );
                        rows[i + 1].arrive = minutesToTime(
                            timeToMinutes(rows[i].depart) + rows[i].duration
                        );
                    }
                }
                break;
            case "point":
                rows[rowIdx].point = newValue;
                break;
            case "note":
                rows[rowIdx].note = newValue;
                break;

        }

        newData[activeTab][date] = rows;
        return newData;
      });
    }



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
        <TrackLink url={`/admin/myTeam/${teamId}/finalCheck/routeCompare`} pageName="行程比較表" teamId={String(teamId)}>
          <button
            className="px-4 py-2 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
            onClick={() =>
              router.push(`/admin/myTeam/${teamId}/finalCheck/routeCompare`)
            }
          >
            行程比較
          </button>
        </TrackLink>
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
      <div className="space-y-8 mt-4">
        {Object.entries(data[activeTab] || {}).map(([date, rows]) => (
          <div key={date} className="space-y-2">
            <div className="flex gap-x-3 items-center">
              <LuMapPinPlus
                title="新增記錄點"
                className="cursor-pointer size-8 p-1 rounded-2xl hover:bg-blue-100"
                onClick={() => handleAddRow(date)}
              />
              <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
            </div>
            <div className="overflow-x-auto shadow">
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
                      key={date + "-" + uuidToNumericId()}
                      className="hover:bg-gray-300"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (confirm("確定要刪除此列嗎？")) {
                          handleDeleteRow(date, rowIdx);
                        }
                      }}
                    >
                      {[
                        "point",
                        "arrive",
                        "rest",
                        "depart",
                        "duration",
                        "note",
                      ].map((field) => {
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
                              className="px-4 py-2 border cursor-pointer h-[35px] relative"
                            >
                              x
                            </td>
                          );
                        }
                        return (
                          <td
                            key={date + "-" + field}
                            className="px-4 py-2 border cursor-pointer h-[35px]"
                            onClick={() =>
                              setEditing({ row: rowIdx, field, date })
                            }
                          >
                            {editing?.row === rowIdx &&
                            editing?.field === field &&
                            editing?.date === date ? (
                              <input
                                type="text"
                                autoFocus
                                defaultValue={row[field as keyof typeof row]}
                                onBlur={(e) => {
                                  setEditing(null);
                                  handleTimeChange(
                                    date,
                                    rowIdx,
                                    field,
                                    e.currentTarget.value
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setEditing(null);
                                    handleTimeChange(
                                      date,
                                      rowIdx,
                                      field,
                                      e.currentTarget.value
                                    );
                                  }
                                }}
                                className="w-full h-full bg-transparent border-none outline-none px-0 py-0 text-sm"
                              />
                            ) : (
                              row[field as keyof typeof row]
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
      {/* Modal */}
      {isModalOpen && (
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
                onClick={() => handleCancel()}
                className="px-3 py-1 rounded border"
              >
                取消
              </button>
              <button
                onClick={saveTime}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanPage;
