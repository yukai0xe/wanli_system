"use client";
import { LuMapPinPlus } from "react-icons/lu";
import { numberToChinese, uuidToNumericId } from "@/lib/utility";
import { useEffect, useState } from "react";
import { routeData } from "@/data/routeData";

type RecordPoint = {
    point: string;
    depart: string;
    arrive: string;
    duration: number;
    rest: number;
    note: string;
}

type Route = Record<string, RecordPoint[]>

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const hours = Math.floor(m / 60);
  const minutes = m % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

const RoutePlanPage = () => {
  const [tabs, setTabs] = useState(["預計行程"]);
  const [activeTab, setActiveTab] = useState(0);

  // 假資料：日期區分
  const [data, setData] = useState<Route[]>(routeData);
    
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editRow, setEditRow] = useState<number | null>(null);
     const [tempDeparture, setTempDeparture] = useState("");
     const [tempArrival, setTempArrival] = useState("");

     const openModal = () => {
        setEditRow(activeTab);  
        const dates = Object.keys(data[activeTab]);
        setTempDeparture(dates[0]);
        setTempArrival(dates[dates.length - 1]);
        setIsModalOpen(true);
     };

     const saveTime = () => {
        if (editRow === null) return;
        const newData = data.map((tab) => {
        const newTab: Route = {};
        for (const key in tab) {
            newTab[key] = [...tab[key]];
        }
        return newTab;
        });
        newData[activeTab] = {};
        const diffTime = new Date(tempArrival).getTime() - new Date(tempDeparture).getTime(); 
        if (diffTime < 0) return;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const oldDates = Object.keys(data[activeTab]); 
        console.log(oldDates)
        let currentDate = tempDeparture;
        for (let i = 0; i < diffDays; i++){
            if (oldDates.includes(currentDate)) newData[activeTab][currentDate] = data[activeTab][currentDate];
            else newData[activeTab][currentDate] = [];
            const dateObj = new Date(currentDate);
            dateObj.setDate(dateObj.getDate() + 1);
            currentDate = dateObj.toISOString().split("T")[0];
         }
        
        setData(newData);
        setIsModalOpen(false);
     };
    
    
    useEffect(() => {
        if (data.length > 0) setTabs(prev => {
            for (let i = tabs.length; i < data.length; i++){
                prev.push("參考行程" + numberToChinese(i));
            }
            return prev;
        })
    }, [data])
    
    const [editing, setEditing] = useState<{
      row: number;
      field: string;
      date: string;
    } | null>(null);

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
            point: "",
            depart: minutesToTime(timeToMinutes(lastRow.arrive) + lastRow.rest),
            arrive: minutesToTime(timeToMinutes(lastRow.arrive) + lastRow.rest),
            duration: 0,
            rest: 0,
            note: "",
          });
        } else {
          rows.push({
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
              for (let i = rowIdx; i < n; i++) {
                if(i === rowIdx) rows[i].duration += delta;
                rows[i].arrive = minutesToTime(
                  timeToMinutes(rows[i].depart) + rows[i].duration
                );
                if (i < n - 1) {
                  rows[i + 1].depart = minutesToTime(
                    timeToMinutes(rows[i].arrive) + rows[i].rest
                  );
                }
              }
            }
            break;
          case "rest":
            if (!isNaN(Number(newValue))) {
              const delta = Number(newValue) - rows[rowIdx].rest;
              for (let i = rowIdx; i < n - 1; i++) {
                if (i === rowIdx) rows[i].rest += delta;
                rows[i + 1].depart = minutesToTime(
                  timeToMinutes(rows[i].arrive) + rows[i].rest
                );
                rows[i + 1].arrive = minutesToTime(
                  timeToMinutes(rows[i + 1].depart) + rows[i + 1].duration
                );
              }
            }
            break;
        }

        newData[activeTab][date] = rows;
        return newData;
      });
    }



  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white p-6">
      {/* Tab 切換列 */}
      <div className="flex gap-2 pb-5">
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
          onClick={() => setTabs([...tabs, `參考行程${tabs.length}`])}
          className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 hover:bg-green-200 text-sm"
        >
          + 新增
        </button>
        <div className="mt-4 text-xs text-gray-500">
          提示：左鍵點擊表格即可編輯，右鍵點擊即可刪除，每個日期左邊的圖示可以新增紀錄點
        </div>
      </div>

      {/* 表格內容 */}
      <div className="space-y-8">
        {Object.entries(data[activeTab]).map(([date, rows]) => (
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
                    <th className="px-4 py-2 border">出發時間</th>
                    <th className="px-4 py-2 border">抵達時間</th>
                    <th className="px-4 py-2 border">行進時間(分鐘)</th>
                    <th className="px-4 py-2 border">休息時間(分鐘)</th>
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
                        "depart",
                        "arrive",
                        "duration",
                        "rest",
                        "note",
                      ].map((field) => (
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
                                        )
                                    } 
                                }}
                                className="w-full h-full bg-transparent border-none outline-none px-0 py-0 text-sm"
                            />
                          ) : (
                            row[field as keyof typeof row]
                          )}
                        </td>
                      ))}
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
                <label className="block text-sm font-medium">出發時間</label>
                <input
                  type="date"
                  value={tempDeparture}
                  onChange={(e) => setTempDeparture(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">抵達時間</label>
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
                onClick={() => setIsModalOpen(false)}
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
