'use client'
import { useState, useEffect } from "react";
import { Button3 } from "@/app/components/button";
import { AnimatedAddNewTeam } from "@/app/components/form/newTeam";
import { usePlanTeamStore, useDraftTeamStore, usePlanTeamMetaStore } from '@/state/planTeamStore';
import { useRouter } from "next/navigation";
import { FaRegSquarePlus } from "react-icons/fa6";
import { apiFetch } from "@/lib/middleware/clientAuth";

const TeamBarComponent = ({ team }: { team: PlanTeamMeta }) => {
  const router = useRouter();
  // const { setTeam } = usePlanTeamStore();
  // const state = usePlanTeamStore.getState();

  const handleClick = async (planTeamId: number) => {
    // if (state.getTeamWithFetch) {
    //   const team = await state.getTeamWithFetch(planTeamId);
    //   setTeam(team);
    // }
    router.push(`/admin/myTeam/${planTeamId}`);
  };

  const startTimestamp = team.startDate
    ? new Date(team.startDate).getTime()
    : null;

  const daysUntil = startTimestamp
    ? Math.ceil((startTimestamp - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const isExpired = daysUntil < 0;
  const progress = isExpired
    ? 100
    : daysUntil > 0
    ? Math.max(0, 100 - (daysUntil / team.duration) * 100)
    : 100;

  // 顏色條件
  const progressColor = isExpired
    ? "bg-gray-400"
    : daysUntil <= 3
    ? "bg-red-500"
      : "bg-blue-500";
  
  return (
    <div
      key={team.id}
      onClick={() => handleClick(team.planTeamId)}
      className="border rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition max-w-3xl mx-auto my-10"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{team.mainName}</h2>
        <span className="text-sm text-gray-500">目前 {team.teamSize} 人</span>
      </div>

      {/* Members */}
      <div className="flex justify-between text-sm mb-4">
        <div>
          <span className="font-medium">領隊：</span>
          {team.leader?.name || "未指派"}
        </div>
        <div>
          <span className="font-medium">嚮導：</span>
          {team.guide?.name || "未指派"}
        </div>
        <div>
          <span className="font-medium">留守：</span>
          {team.staybehind?.name || "未指派"}
        </div>
      </div>

      {/* Timeline / Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          {isExpired ? (
            <span className="text-red-600 font-medium">已結束</span>
          ) : (
            <span>出發倒數 {daysUntil} 天</span>
          )}
          <span>行程 {team.duration} 天</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${progressColor} h-2 rounded-full transition-all`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Event State */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-medium mb-2">當前狀態：</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {Object.entries(team.eventState).map(([key, value]) => (
            <li key={key}>
              {key}: {String(value)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const MainPage = () => {
  const [addNewTeam, setAddNewTeam] = useState(false);
  const { setTeam, setId } = usePlanTeamStore();
  const draftTeam = useDraftTeamStore((state) => state.team);
  const { addPlanTeamMeta, setPlanTeamMeta } = usePlanTeamMetaStore();
  const planTeams = usePlanTeamMetaStore((state) => state.teamMetas);
  const { resetTeam } = useDraftTeamStore();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // initial
  useEffect(() => {
    setLoading(true);
    apiFetch<PlanTeamMeta[]>('/planTeam')
      .then((allTeamMeta) => {
        setPlanTeamMeta(allTeamMeta);
      })
      .finally(() => setLoading(false));
  }, []);

  // store
  const saveTeam = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{
        planTeam: PlanTeam,
        id: number,
        metaData: PlanTeamMeta
      }>("/planTeam", {
        method: "POST",
        body: JSON.stringify(draftTeam)
      });
      alert("儲存成功");
      if (data?.planTeam) setTeam(data.planTeam);
      if (data?.id && setId) setId(data.id);
      if (data?.metaData) addPlanTeamMeta(data.metaData);

      resetTeam();
      if (data?.id) router.replace(`/admin/myTeam/${data.id}`);
    } catch (error) {
      if (error instanceof Error) alert(`儲存失敗: ${error.message}`);
      else alert("儲存失敗: 發生未知錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center flex-col p-10 gap-y-5">
      {!addNewTeam ? (
        <>
          <Button3 handleClick={() => setAddNewTeam(true)}>
            <FaRegSquarePlus className="size-8" />
            我要開隊
          </Button3>
          <div className="w-full max-w-4xl mx-auto">
            {planTeams.length > 0 ? (
              planTeams.map((team) => (
                <TeamBarComponent key={team.id} team={team} />
              ))
            ) : (
              <>
                {loading ? (
                  "載入你的隊伍中..."
                ) : (
                  <div className="m-10 p-5 border">
                    <p>你現在還沒有開任何隊伍</p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <AnimatedAddNewTeam
            cancel={() => setAddNewTeam(false)}
            submit={() => saveTeam()}
          />
        </>
      )}
    </div>
  );
}

export default MainPage;