'use client';
import React, { useEffect, useState } from "react";
import { routeData } from "@/data/routeData"; // 你的資料檔案


type RowData = {
  point: string;
  routes: (RecordPoint | null)[];
};

type dayTableData = {
    day: string;
    dayPoints: RowData[]
}

interface EditableCellProps {
    arrive: string;
    rest: number;
    onChange: (arrive: string, rest: number) => void;
    onBlur: () => void;
    onDoubleClick: () => void;
}

function EditableCell({
  arrive,
  rest,
  onChange,
  onBlur,
  onDoubleClick
}: EditableCellProps) {
  const [arriveVal, setArriveVal] = useState(arrive);
  const [restVal, setRestVal] = useState(rest.toString());

  return (
    <div
        className="flex flex-col gap-y-1"
        tabIndex={-1}
        onDoubleClick={() => onDoubleClick()}
        onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            onChange(arriveVal, Number(restVal));
            onBlur();
            }
        }}
    >
      <label className="flex items-center text-sm">
        抵達：
        <input
          type="text"
          value={arriveVal}
          onChange={(e) => setArriveVal(e.target.value)}
          className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
        />
      </label>

      <label className="flex items-center text-sm">
        休息(分鐘)：
        <input
          type="text"
          value={restVal}
          onChange={(e) => setRestVal(e.target.value)}
          className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
        />
      </label>
    </div>
  );
}

const RouteComparePage = () => {
    const [data,] = useState<Route[]>(routeData);
    const [tabs, setTabs] = useState([""]);
    const [activeTab, setActiveTab] = useState(0);
    
    const [editing, setEditing] = useState<{
        routeIdx: number;
        pointId: string;
    } | null>(null);

    const [editDuration, setEditDuration] = useState<{
      routeIdx: number;
      pointId: string;
    } | null>(null);

  // 取得所有紀錄點
  const allPoints = Array.from(
    new Set(
      data.flatMap((route) =>
        Object.values(route).flatMap((day) => day.map((r) => r.point))
      )
    )
  );

  // 建立比較表資料
  const pointsTableData: RowData[] = allPoints.map((point) => ({
    point,
    routes: data.map((route) => {
      for (const dayRecords of Object.values(route)) {
        const match = dayRecords.find((r) => r.point === point);
        if (match) return match;
      }
      return null;
    }),
  }));
    
    const dayTablesData: dayTableData[] = Object.values(data[0]).map((day, idx) => {
        const points = day.map(d => d.point);
        return {
            day: "Day" + (idx + 1),
            dayPoints: pointsTableData.filter(row => points.includes(row.point))
        }
    });

    useEffect(() => {
        setTabs(dayTablesData.map((_, idx) => "Day" + (idx + 1)));
    }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="w-full flex gap-x-5 items-center mb-4">
        <h1 className="text-2xl font-bold">行程比較表</h1>
        <div className="flex gap-x-2">
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
        </div>
      </div>
      <div className="text-xs text-gray-500">
        提示 1：左鍵點擊表格即可編輯，連續點擊兩次即可取消編輯
      </div>
      <div className="text-xs text-gray-500">
        提示 2：每份行程要比較的紀錄點要相同名稱，不然無法成功比較
      </div>
      <h2 className="text-xl pt-4 pb-2">{dayTablesData[activeTab].day}</h2>
      <div className="overflow-x-auto overflow-y-auto max-h-screen">
        <table
          className="min-w-full table-fixed border-collapse border border-gray-200 text-sm"
          style={{ width: "max-content" }}
        >
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">紀錄點</th>
              {data.map((_, idx) => (
                <th key={idx} className="px-4 py-2 border">
                  {idx === 0 ? "預計行程" : `參考行程 ${idx}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayTablesData[activeTab].dayPoints.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <tr key={row.point} className="hover:bg-gray-200">
                  <td className="px-4 py-2 border text-lg w-[300px]">
                    {row.point}
                  </td>
                  {row.routes.map((route, routeIdx) => (
                    <td
                      key={routeIdx}
                      className="px-4 py-2 border cursor-pointer w-[250px]"
                      onClick={() =>
                        setEditing(
                          route ? { routeIdx, pointId: route.id } : null
                        )
                      }
                      style={{ width: "max-content" }}
                    >
                      {route ? (
                        editing?.routeIdx === routeIdx &&
                        editing?.pointId === route.id ? (
                          <EditableCell
                            arrive={route.arrive}
                            rest={route.rest}
                            onChange={() => {}}
                            onBlur={() => setEditing(null)}
                            onDoubleClick={() => setEditing(null)}
                          />
                        ) : (
                          <div className="space-y-1">
                            <div>
                              抵達：{route.arrive}{" "}
                              {route.rest > 0 && `(休息 ${route.rest} 分鐘)`}
                            </div>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {rowIdx !== dayTablesData[activeTab].dayPoints.length - 1 && (
                  <tr className="hover:bg-gray-200">
                    <td className="px-4 py-2 border text-xs">經過時間</td>
                    {row.routes.map((route, routeIdx) => (
                      <td
                        key={routeIdx}
                        className="px-4 py-2 border"
                        onClick={() =>
                          setEditDuration(
                            route ? { routeIdx, pointId: route.id } : null
                          )
                        }
                      >
                        {route ? (
                          editDuration?.routeIdx === routeIdx &&
                          editDuration?.pointId === route.id ? (
                            <label className="flex items-center text-sm">
                              <input
                                type="text"
                                autoFocus
                                value={route.duration}
                                onChange={() => {}}
                                onBlur={() => setEditDuration(null)}
                                onDoubleClick={() => setEditDuration(null)}
                                className="bg-transparent w-full p-0 m-0 text-sm border-none outline-none"
                              />
                            </label>
                          ) : (
                            <div className="space-y-1">
                              <div>{route.duration} 分鐘</div>
                            </div>
                          )
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteComparePage;
