'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useRouteStore } from "@/state/routeStore";

type dayTableData = {
  day: string;
  dayPoints: {
    point: string,
    routes: (RecordPoint & { date: string; routeId: string; } | null)[]
  }[];
}

interface EditableCellProps {
    arrive: string | null;
    depart: string | null;
    rest: number;
    onChange: (arrivDepart: string, rest: number) => void;
    onBlur: () => void;
    onDoubleClick: () => void;
}

function EditableCell({
  arrive,
  depart,
  rest,
  onChange,
  onBlur,
  onDoubleClick
}: EditableCellProps) {
  const [arriveVal, setArriveVal] = useState<string | null>(arrive);
  const [departVal, setDepartVal] = useState<string | null>(depart);
  const [restVal, setRestVal] = useState(rest.toString());

  return (
    <div
      className="flex flex-col gap-y-1"
      tabIndex={-1}
      onDoubleClick={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (arriveVal !== null) onChange(arriveVal, Number(restVal));
          if (departVal !== null) onChange(departVal, Number(restVal));
          onDoubleClick();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (arriveVal !== null) onChange(arriveVal, Number(restVal));
          if (departVal !== null) onChange(departVal, Number(restVal));
          onBlur();
        }
      }}
    >
      {arriveVal != null && (
        <label className="flex items-center text-sm">
          抵達：
          <input
            type="text"
            value={arriveVal}
            onChange={(e) => setArriveVal(e.target.value)}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {departVal != null && (
        <label className="flex items-center text-sm">
          出發：
          <input
            type="text"
            value={departVal}
            onChange={(e) => setDepartVal(e.target.value)}
            className="bg-transparent w-36 py-1 px-2 m-0 text-sm border border-solid shadow-sm outline-none"
          />
        </label>
      )}
      {arriveVal != null && (
        <label className="flex items-center text-sm">
          休息(分鐘)：
          <input
            type="text"
            value={restVal}
            onChange={(e) => setRestVal(e.target.value)}
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
  const [duration, setDuration] = useState<string>();

  const [editing, setEditing] = useState<{
    isDuration: boolean;
    date: string;
    routeId: string;
    pointId: string;
  } | null>(null);

  // 建立比較表資料
  const routeIdxs = Array.from({ length: data.length }, () => 0);
  const dayTablesData: dayTableData[] = Object.values(data[0].days).flatMap(
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
  );

  const saveRoutes = (
    route: Partial<Exclude<RecordPoint, "id" | "point" | "note">>
  ) => {
    if (route.arrive !== undefined && editing)
      handleTimeChange(
        {
          field: "arrive",
          date: editing?.date,
          routeId: editing?.routeId,
          pointId: editing?.pointId,
        },
        route.arrive
      );

    if (route.depart !== undefined && editing)
      handleTimeChange(
        {
          field: "depart",
          date: editing?.date,
          routeId: editing?.routeId,
          pointId: editing?.pointId,
        },
        route.depart
      );

    if (route.rest !== undefined && editing)
      handleTimeChange(
        {
          field: "rest",
          date: editing?.date,
          routeId: editing?.routeId,
          pointId: editing?.pointId,
        },
        route.rest
      );

    if (route.duration !== undefined && editing)
      handleTimeChange(
        {
          field: "duration",
          date: editing?.date,
          routeId: editing?.routeId,
          pointId: editing?.pointId,
        },
        route.duration
      );
    setEditing(null);
  };

  useEffect(() => {
    setTabs(dayTablesData.map((_, idx) => "Day" + (idx + 1)));
  }, []);

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
                          route
                            ? {
                                isDuration: false,
                                date: route.date,
                                routeId: route.routeId,
                                pointId: route.id,
                              }
                            : null
                        )
                      }
                      style={{ width: "max-content" }}
                    >
                      {route ? (
                        !editing?.isDuration &&
                        editing?.routeId === route.routeId &&
                        editing?.pointId === route.id ? (
                          <EditableCell
                            arrive={rowIdx !== 0 ? route.arrive : null}
                            depart={rowIdx === 0 ? route.depart : null}
                            rest={route.rest}
                            onChange={(val, rest) => {
                              if (rowIdx === 0)
                                saveRoutes({
                                  depart: val,
                                });
                              else
                                saveRoutes({
                                  arrive: val,
                                  rest: rest,
                                });
                            }}
                            onBlur={() => setEditing(null)}
                            onDoubleClick={() => setEditing(null)}
                          />
                        ) : (
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
                                `(休 ${route.rest}')`}
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
                        onClick={() => {
                          setEditing(
                            route
                              ? {
                                  isDuration: true,
                                  date: route.date,
                                  routeId: route.routeId,
                                  pointId: route.id,
                                }
                              : null
                          );
                          setDuration(route?.duration.toString());
                        }}
                      >
                        {route ? (
                          editing?.isDuration &&
                          editing?.routeId === route.routeId &&
                          editing?.pointId === route.id ? (
                            <label className="flex items-center text-sm">
                              <input
                                type="text"
                                autoFocus
                                value={duration || ""}
                                onChange={(e) => {
                                  if (isNaN(Number(e.currentTarget.value))) return;
                                  setDuration(e.currentTarget.value)
                                }}
                                onBlur={() => {
                                  saveRoutes({ duration: Number(duration) });
                                }}
                                onDoubleClick={() => {
                                  saveRoutes({ duration: Number(duration) });
                                }}
                                className="bg-transparent w-full p-0 m-0 text-sm border-none outline-none"
                              />
                            </label>
                          ) : (
                            <div className="space-y-1">
                              <div>
                                {route.duration}
                                {"'"}
                              </div>
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
