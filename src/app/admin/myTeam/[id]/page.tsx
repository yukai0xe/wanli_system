'use client';
import { Timeline, TimelineItem, MoreTimeLineItem } from "@/app/components/timeline";
import { usePlanTeamStore, usePlanTeamMetaStore } from "@/state/planTeamStore";
import { useRouter } from "next/navigation";
import { timelineData } from "@/lib/viewModel/timeLine";
import { useEffect, useState } from "react";
import { Event } from "@/types/enum";
import { parseEnumKey } from "@/lib/utility";

interface FileItem {
  id: string;
  name: string;
  url: string;
}

export default function TeamOverview() {
  const router = useRouter();

  const recentFiles: FileItem[] = [];
  const team = usePlanTeamStore(state => state.team);
  const teamId = usePlanTeamStore(state => state.id);
  const { getPlanTeamMetaById, teamMetas }  = usePlanTeamMetaStore();
  const today = new Date();
  const startDate = new Date(team.startDate);
  const daysLeft = Math.max(
    0,
    Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
  );
  const complete = (Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) < 0);
  const [timelineViewData, setTimeLineViewData] = useState<(TimelineItem & MoreTimeLineItem)[]>(
    timelineData.map((data) => {
      return {
        ...data,
        body: [{text: ""}],
      };
    }));

  useEffect(() => {
    const eventState = getPlanTeamMetaById(teamId as number)?.eventState;
    if (eventState) {
      const keys = Object.keys(eventState).map(
        (key) => Event[key as keyof typeof Event]
      ) as Event[];

      setTimeLineViewData(timelineData.map((data) => {
        return {
          ...data,
          body: [
            {
              text: keys.includes(data.label as Event)
                ? eventState[parseEnumKey(Event, data.label)]
                : "",
            },
          ],
        };
      }))
    }
  }, [teamId, teamMetas]);
  
  return (
    <div className="flex space-x-6 p-6">
      {/* 左邊 Timeline - 固定寬度 */}
      <div className="w-1/3">
        <Timeline items={timelineViewData} />
      </div>

      {/* 右邊 Overview - 佔剩餘寬度 */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-3">{team.mainName}</h1>
        <div className="mb-4 text-gray-700 bg-gray-50 rounded-lg p-6 shadow">
          <p>
            <span className="font-semibold">出發時間：</span>{" "}
            {typeof team.startDate === "string"
              ? team.startDate
              : team.startDate?.toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">結束時間：</span>{" "}
            {typeof team.endDate === "string"
              ? team.endDate
              : team.endDate?.toLocaleDateString()}
          </p>
          {!complete ? 
            <p className="mt-2 text-blue-600 font-semibold"> 距離出發還剩 {daysLeft} 天 </p> :
            <p className="mt-2 text-red-600 font-semibold"> 此活動已結束 </p>
          }
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">常用檔案</h2>
          {recentFiles.length === 0 ? (
            <p className="text-gray-500">尚無常用檔案</p>
          ) : (
            <ul>
              {recentFiles.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200"
                >
                  <button
                    className="text-left text-blue-600 hover:underline flex-1"
                    onClick={() => router.push(file.url)}
                  >
                    {file.name}
                  </button>
                  <button
                    className="ml-4 text-red-500 hover:text-red-700"
                    // onClick={() => onDeleteFile(file.id)}
                    aria-label={`刪除檔案 ${file.name}`}
                    title="刪除檔案"
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
