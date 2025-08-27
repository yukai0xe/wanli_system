'use client';
import { Timeline, TimelineItem, MoreTimeLineItem } from "@/app/components/timeline";
import { usePlanTeamStore, usePlanTeamMetaStore } from "@/state/planTeamStore";
import { useRouter } from "next/navigation";
import { timelineData } from "@/data/timeLine";
import { useEffect, useState } from "react";
import { Event, TeamRole, TransportType } from "@/types/enum";
import { parseEnumKey, uuidToNumericId } from "@/lib/utility";
import { PiNotePencilFill } from "react-icons/pi";
import InputComponent from "@/app/components/form/input";
import { FaPhoneAlt } from "react-icons/fa";

interface FileItem {
  id: string;
  name: string;
  url: string;
}

export default function TeamOverview() {
  const router = useRouter();
  const [editTeam, setEditTeam] = useState<boolean>(false);
  const { setTeam, team } = usePlanTeamStore();
  const teamId = usePlanTeamStore((state) => state.id);
  const recentFiles: FileItem[] = [];
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
    <div className="flex space-x-6 p-6 ml-12">
      {/* 左邊 Timeline - 固定寬度 */}
      <div className="w-1/3">
        <Timeline items={timelineViewData} />
      </div>

      {/* 右邊 Overview - 佔剩餘寬度 */}
      <div className="w-2/3">
        <div className="flex gap-x-2 items-end mb-3">
          <h1 className="text-2xl font-bold">
            {team.mainName || "載入隊伍資料中..."}
          </h1>
          {!complete ? (
            <p className="text-blue-600 font-semibold">
              {" "}
              距離出發還剩 {daysLeft} 天{" "}
            </p>
          ) : (
            <p className="text-red-600 font-semibold"> 此活動已結束 </p>
          )}
        </div>
        <div
          className={`w-full relative flex flex-col gap-y-3 mb-4 
          text-gray-700 bg-gray-50 rounded-lg p-6 shadow`}
        >
          <PiNotePencilFill
            title="編輯內容"
            onClick={() => setEditTeam(!editTeam)}
            className={`cursor-pointer size-10 absolute top-0 right-0 
            hover:bg-gray-300 rounded duration-200 trasition p-1 mr-3 mt-3 ${
              editTeam && "bg-gray-300 rounded"
            }`}
          />
          {!editTeam ? (
            <>
              <p>
                <span className="font-semibold">出隊時間：</span>
                {typeof team.startDate === "string"
                  ? team.startDate.split("T")[0]
                  : team.startDate?.toLocaleDateString()}
                {team.startDate !== team.endDate && " ~ "}
                {team.startDate !== team.endDate &&
                typeof team.endDate === "string"
                  ? team.endDate.split("T")[0]
                  : team.endDate?.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">預備天：</span>
                {team.prepareDate} 天
              </p>
              <p>
                <span className="font-semibold">交通方式：</span>
                {team.transportType.length > 0
                  ? team.transportType.join(", ")
                  : "尚未決定"}
              </p>
              <div className="flex justify-between w-2/3">
                <span>
                  {`${TeamRole.Leader}: ${
                    team.members.find(
                      (m) => m.role === parseEnumKey(TeamRole, TeamRole.Leader)
                    )?.name || "尚未指派"
                  }`}
                  <div className="flex gap-x-2 items-center">
                    <FaPhoneAlt className="size-3" />
                    {team.members.find(
                      (m) => m.role === parseEnumKey(TeamRole, TeamRole.Leader)
                    )?.phone || "缺少聯絡電話"}
                  </div>
                </span>
                <span>
                  {`${TeamRole.Guide}: ${
                    team.members.find(
                      (m) => m.role === parseEnumKey(TeamRole, TeamRole.Guide)
                    )?.name || "尚未指派"
                  }`}
                  <div className="flex gap-x-2 items-center">
                    <FaPhoneAlt className="size-3" />
                    {team.members.find(
                      (m) => m.role === parseEnumKey(TeamRole, TeamRole.Guide)
                    )?.phone || "缺少聯絡電話"}
                  </div>
                </span>
                <span>
                  {`${TeamRole.StayBehind}: ${
                    team.members.find(
                      (m) =>
                        m.role === parseEnumKey(TeamRole, TeamRole.StayBehind)
                    )?.name || "尚未指派"
                  }`}
                  <div className="flex gap-x-2 items-center">
                    <FaPhoneAlt className="size-3" />
                    {team.members.find(
                      (m) =>
                        m.role === parseEnumKey(TeamRole, TeamRole.StayBehind)
                    )?.phone || "缺少聯絡電話"}
                  </div>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full pr-10">
                <InputComponent
                  direction
                  label="出發日期"
                  value={
                    typeof team.startDate === "string"
                      ? team.startDate.split("T")[0]
                      : team.startDate?.toLocaleDateString()
                  }
                  input={{ type: "date" }}
                  inputChangeHandler={(v: string) =>
                    setTeam({ ...team, startDate: v })
                  }
                />
                <InputComponent
                  direction
                  label="結束日期"
                  value={
                    typeof team.endDate === "string"
                      ? team.endDate.split("T")[0]
                      : team.endDate?.toLocaleDateString()
                  }
                  input={{ type: "date" }}
                  inputChangeHandler={(v: string) =>
                    setTeam({ ...team, endDate: v })
                  }
                />
                <InputComponent
                  direction
                  label="預備天"
                  value={team.prepareDate}
                  input={{ type: "number" }}
                  inputChangeHandler={(v: string) =>
                    setTeam({ ...team, prepareDate: Number(v) })
                  }
                />
                <InputComponent
                  direction
                  label="交通方式"
                  value={team.transportType}
                  input={{
                    type: "multicheckbox",
                    value: Object.entries(TransportType).map(([key, value]) => {
                      return {
                        label: value,
                        value: key,
                      };
                    }),
                  }}
                  inputChangeHandler={(v: string) => {
                    setTeam({ ...team, transportType: JSON.parse(v) });
                  }}
                />
                {[TeamRole.Leader, TeamRole.Guide, TeamRole.StayBehind].map(
                  (role, idx) => (
                    <div className="flex gap-x-1" key={idx}>
                      <div className="flex-grow">
                        <InputComponent
                          direction
                          label={role}
                          placeholder={`輸入${role}名稱`}
                          value={
                            team.members.find(
                              (m) => m.role === parseEnumKey(TeamRole, role)
                            )?.name || ""
                          }
                          input={{ type: "text" }}
                          inputChangeHandler={(v: string) => {
                            if (team.members.some((m) => m.role === role)) {
                              setTeam({
                                ...team,
                                members: team.members.map((m) =>
                                  m.role === parseEnumKey(TeamRole, role)
                                    ? { ...m, name: v }
                                    : m
                                ),
                              });
                            } else {
                              setTeam({
                                ...team,
                                members: [
                                  ...team.members,
                                  {
                                    id: uuidToNumericId(),
                                    name: v,
                                    phone: "",
                                    IDNumber: "",
                                    studentNumber: "",
                                    role,
                                  },
                                ],
                              });
                            }
                          }}
                        />
                      </div>
                      <InputComponent
                        direction
                        nolabel
                        placeholder={`輸入${role}電話`}
                        value={
                          team.members.find(
                            (m) => m.role === parseEnumKey(TeamRole, role)
                          )?.phone || ""
                        }
                        input={{ type: "text" }}
                        inputChangeHandler={(v: string) => {
                          if (
                            team.members.some(
                              (m) => m.role === parseEnumKey(TeamRole, role)
                            )
                          ) {
                            setTeam({
                              ...team,
                              members: team.members.map((m) =>
                                m.role === parseEnumKey(TeamRole, role)
                                  ? { ...m, phone: v }
                                  : m
                              ),
                            });
                          } else {
                            setTeam({
                              ...team,
                              members: [
                                ...team.members,
                                {
                                  id: uuidToNumericId(),
                                  name: "",
                                  phone: v,
                                  IDNumber: "",
                                  studentNumber: "",
                                  role,
                                },
                              ],
                            });
                          }
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </>
          )}
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
