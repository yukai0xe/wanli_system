'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useRouteStore } from "@/state/routeStore";
import { createPortal } from "react-dom";

type dayPoint = {
  point: string;
  routes: ((RecordPoint & { date: string; routeId: string }) | null)[];
};

type dayTableData = {
  day: string;
  dayPoints: dayPoint[];
}

interface EditableCellProps {
  arrive?: string;
  depart?: string;
  rest?: number;
  duration?: number;
  compareDetail?: string;
  style?: React.CSSProperties;
  onChange: (
    res:
      | { field: "depart"; value: string }
      | { field: "arrive"; value: string }
      | { field: "duration"; value: number }
      | { field: "rest"; value: number }
      | { field: "compareDetail"; value: string }
  ) => void;
  onBlur: () => void;
}

interface EditableCell {
  isDuration: boolean;
  date: string;
  routeId: string;
  pointId: string;
}

function EditableCell({
  arrive,
  depart,
  rest,
  duration,
  compareDetail,
  style,
  onChange,
  onBlur,
}: EditableCellProps) {
  const [arriveVal, setArriveVal] = useState<string | null>(arrive ?? null);
  const [departVal, setDepartVal] = useState<string | null>(depart ?? null);
  const [restVal, setRestVal] = useState<string | null>(rest?.toString() ?? null);
  const [durationVal, setDurationVal] = useState<string | null>(duration?.toString() ?? null);
  const [compareDetailVal, setCompareDetailVal] = useState<string | null>(compareDetail ?? null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onBlur();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [arriveVal, departVal, restVal, onChange, onBlur]);

  return (
    <div
      style={style}
      className="flex flex-col gap-y-1 fixed bg-white p-2 border border-gray-300 shadow-lg z-10 mt-2"
      tabIndex={-1}
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
    >
      {arriveVal != null && (
        <label className="flex items-center text-sm">
          預計抵達時間：
          <input
            type="text"
            value={arriveVal}
            onChange={(e) => {
              setArriveVal(e.target.value);
              onChange({
                field: "arrive",
                value: e.target.value,
              });
            }}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {departVal != null && (
        <label className="flex items-center text-sm">
          預計出發時間：
          <input
            type="text"
            value={departVal}
            onChange={(e) => {
              setDepartVal(e.target.value);
              onChange({
                field: "depart",
                value: e.target.value,
              });
            }}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {durationVal != null && (
        <label className="flex items-center text-sm">
          預計行進時間：
          <input
            type="text"
            value={durationVal}
            onChange={(e) => {
              setDurationVal(e.target.value);
              onChange({
                field: "duration",
                value: Number(e.target.value),
              });
            }}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {restVal != null && (
        <label className="flex items-center text-sm">
          預計休息時間(分鐘)：
          <input
            type="text"
            value={restVal}
            onChange={(e) => {
              setRestVal(e.target.value);
              if (arriveVal)
                onChange({
                  field: "rest",
                  value: Number(e.target.value),
                });
            }}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {compareDetailVal != null && (
        <label className="flex items-center text-sm">
          備註：
          <input
            type="text"
            value={compareDetailVal}
            onChange={(e) => {
            setCompareDetailVal(e.target.value);
              onChange({
                field: "compareDetail",
                value: e.target.value,
              });
            }}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
    </div>
  );
}

const RouteComparePage = () => {
  const { handleTimeChange } = useRouteStore();
  const data = useRouteStore((state) => state.routes);
  const [tabs, setTabs] = useState([""]);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const teamId = usePlanTeamStore((state) => state.id);
  const [editing, setEditing] = useState<EditableCell | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0 });
  const [dayTablesData, setDayTablesData] = useState<dayTableData[]>([]);

  const isEditing = (routeId?: string, pointId?: string) => {
    return (
      editing?.routeId === routeId &&
      editing?.pointId === pointId
    );
  }

  const editHandler = (rect: DOMRect, editCell: EditableCell | null) => {
    if (editCell === null || isEditing(editCell.routeId, editCell.pointId)) setEditing(null);
    else {
      setPos({ x: rect.left, y: rect.bottom, w: rect.width });
      setEditing(editCell);
    }
  };

  const saveRoutes = (
    route: Partial<Exclude<RecordPoint, "id" | "point" | "note">>
  ) => {
   if (!editing) return;
   (["arrive", "depart", "rest", "duration", "compareDetail"] as const).forEach(
     (field) => {
       const value = route[field];
       if (value !== undefined) {
         handleTimeChange(
           {
             field,
             date: editing.date,
             routeId: editing.routeId,
             pointId: editing.pointId,
           },
           value
         );
       }
     }
   );
  };

  useEffect(() => {
    setTabs(dayTablesData.map((_, idx) => "Day" + (idx + 1)));
  }, [dayTablesData]);

  useEffect(() => {
    const routeIdxs = Array.from({ length: data.length }, () => 0);
    setDayTablesData(Object.values(data[0].days).flatMap(
      (day, idx) => ({
        day: "Day" + (idx + 1),
        dayPoints: day.map((target) => ({
          point: target.point,
          routes: data.map((route, idx) => {
            const currentRecord = Object.entries(route.days).flatMap(
              ([date, items]) => items.map((item) => ({ date, ...item }))
            );
            while (routeIdxs[idx] < currentRecord.length) {
              if (currentRecord[routeIdxs[idx]].point === target.point) {
                return {
                  routeId: route.id,
                  ...currentRecord[routeIdxs[idx]++],
                };
              }
              routeIdxs[idx]++;
            }
            return null;
          }),
        })),
      })
    ))
  }, [data]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="w-full flex gap-x-5 items-center justify-between mb-4">
        <div className="flex gap-x-5 items-center">
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
        <button
          className="px-4 py-2 rounded bg-amber-200 text-gray-800 hover:bg-amber-300"
          onClick={() =>
            router.push(`/admin/myTeam/${teamId}/finalCheck?tab=4`)
          }
        >
          返回計劃書
        </button>
      </div>
      <div className="text-xs text-gray-500">
        提示 1：左鍵點擊表格即可編輯，連續點擊兩次即可取消編輯
      </div>
      <div className="text-xs text-gray-500">
        提示 2：每份行程要比較的紀錄點要相同名稱，不然無法成功比較
      </div>
      {dayTablesData.length === 0 ? (
        <div className="flex flex-col text-center gap-y-5 ">
          <p className="text-5xl">無行程資料</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl pt-4 pb-2">{dayTablesData[activeTab].day}</h2>
          <div className="overflow-x-auto overflow-y-hidden">
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
                          key={route?.id ?? routeIdx}
                          className="px-4 py-2 border cursor-pointer w-[250px] relative"
                          onClick={(e) => {
                            editHandler(
                              (
                                e.currentTarget as HTMLElement
                              ).getBoundingClientRect(),
                              route
                                ? {
                                    isDuration: false,
                                    date: route.date,
                                    routeId: route.routeId,
                                    pointId: route.id,
                                  }
                                : null
                            );
                          }}
                          style={{ width: "max-content" }}
                        >
                          {route ? (
                            <>
                              <div className="space-y-1">
                                <div
                                  title={`抵達時間 ${
                                    rowIdx === 0 ? route.depart : route.arrive
                                  }${
                                    rowIdx !== 0 && route.rest > 0
                                      ? ` 休 ${route.rest}'`
                                      : ""
                                  }`}
                                >
                                  {rowIdx === 0 ? route.depart : route.arrive}{" "}
                                  {rowIdx !== 0 &&
                                    route.rest > 0 &&
                                    `(休 ${route.rest}')`}{" "}
                                  {route.compareDetail}
                                </div>
                              </div>
                              {!editing?.isDuration &&
                                isEditing(route?.routeId, route?.id) &&
                                createPortal(
                                  <EditableCell
                                    arrive={
                                      rowIdx !== 0 ? route.arrive : undefined
                                    }
                                    depart={
                                      rowIdx === 0 ? route.depart : undefined
                                    }
                                    rest={
                                      rowIdx !== dayTablesData[activeTab].dayPoints.length - 1 && rowIdx !== 0
                                        ? route.rest
                                        : undefined
                                    }
                                    compareDetail={route.compareDetail}
                                    style={{
                                      top: pos.y,
                                      left: pos.x,
                                      width: pos.w,
                                    }}
                                    onChange={(res) => saveRoutes({ [res.field]: res.value })}
                                    onBlur={() => setEditing(null)}
                                  />,
                                  document.body
                                )}
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {rowIdx !==
                      dayTablesData[activeTab].dayPoints.length - 1 && (
                      <tr className="hover:bg-gray-200">
                        <td className="px-4 py-2 border text-xs"></td>
                        {row.routes.map((route, routeIdx) => (
                          <td
                            key={routeIdx}
                            className="px-4 py-2 border cursor-pointer"
                            onClick={(e) => {
                              editHandler(
                                (
                                  e.currentTarget as HTMLElement
                                ).getBoundingClientRect(),
                                route
                                  ? {
                                      isDuration: true,
                                      date: route.date,
                                      routeId: route.routeId,
                                      pointId: route.id,
                                    }
                                  : null
                              );
                            }}
                          >
                            {route ? (
                              <>
                                <div className="space-y-1">
                                  <div>
                                    {route.duration}
                                    {"'"}
                                  </div>
                                </div>
                                {editing?.isDuration &&
                                  isEditing(route?.routeId, route?.id) &&
                                  createPortal(
                                    <EditableCell
                                      duration={route.duration}
                                      style={{
                                        top: pos.y,
                                        left: pos.x,
                                        width: pos.w,
                                      }}
                                      onChange={(res) => saveRoutes({ [res.field]: res.value })}
                                      onBlur={() => setEditing(null)}
                                    />,
                                    document.body
                                  )}
                              </>
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
        </>
      )}
    </div>
  );
};

export default RouteComparePage;
