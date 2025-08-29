'use client';
import React, { useState } from "react";
import { routeData } from "@/data/routeData"; // 你的資料檔案

type RecordPoint = {
  point: string;
  depart: string;
  arrive: string;
  duration: number;
  rest: number;
  note: string;
};

type RowData = {
  point: string;
  routes: (RecordPoint | null)[];
};

const RouteComparePage = () => {
  const [data,] = useState<Route[]>(routeData);

  // 取得所有紀錄點
  const allPoints = Array.from(
    new Set(
      data.flatMap((route) =>
        Object.values(route).flatMap((day) => day.map((r) => r.point))
      )
    )
  );

  // 建立比較表資料
  const tableData: RowData[] = allPoints.map((point) => ({
    point,
    routes: data.map((route) => {
      // 尋找這個行程的紀錄點
      for (const dayRecords of Object.values(route)) {
        const match = dayRecords.find((r) => r.point === point);
        if (match) return match;
      }
      return null; // 沒有這個紀錄點
    }),
  }));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">行程比較表</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-200 text-sm">
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
            {tableData.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr key={row.point} className="hover:bg-gray-200">
                  <td className="px-4 py-2 border font-medium">{row.point}</td>
                  {row.routes.map((route, idx) => (
                    <td key={idx} className="px-4 py-2 border">
                      {route ? (
                        <div className="space-y-1">
                          <div>抵達: {route.arrive} {route.rest > 0 && `(休息 ${route.rest} 分鐘)`}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-200">
                  <td className="px-4 py-2 border font-medium"></td>
                  {row.routes.map((route, idx) => (
                    <td key={idx} className="px-4 py-2 border">
                      {route ? (
                        <div>
                          <div className="space-y-1">
                            <div>{route.duration}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteComparePage;
