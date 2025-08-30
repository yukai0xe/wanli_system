"use client";
// import { useState, useEffect } from "react";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useDraftTeamMemberStore } from "@/state/teamMemberStore";
import styles from "@/assets/styles/finalCheck.module.css"
import { useState, useRef, useEffect } from "react";
import TeamMember from "@/app/admin/TeamMember";
import ItemList from "@/app/admin/ItemList";
import { finalPlanType, TeamRole } from "@/types/enum";
import RoutePlan from "@/app/admin/RoutePlan";
import { useSearchParams } from "next/navigation";
import {
  teamMemberFakeData as tmfake,
} from "@/data/tableData";
import { parseEnumKey } from "@/lib/utility";

const tabs = Object.values(finalPlanType).map((type) => {
  return {
    label: type
  };
});

const Page = () => {
  const searchParams = useSearchParams();
  const { setTeam, team } = usePlanTeamStore();
  const { member } = useDraftTeamMemberStore();
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0 });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [teamMembers, setTeamMembers] = useState<RowData[]>([]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setSelectedTab(Number(tabParam));
    }
  }, [searchParams]);
  

  useEffect(() => {
    if (tabRefs.current[selectedTab]) {
      const tabRect = tabRefs.current[selectedTab]!.getBoundingClientRect();
      const parent = tabRefs.current[0]?.parentNode;

      if (parent instanceof HTMLElement) {
        const containerRect = parent.getBoundingClientRect();
        setIndicatorStyle({
          width: tabRect.width,
          x: tabRect.left - containerRect.left,
        });
      }
    }
  }, [selectedTab, tabs]);

  useEffect(() => {
    if (team.members && team.members.length > 0) {
      setTeamMembers(
        team.members.map(({ role, birth, ...m }, idx) => {
          return {
            ...m,
            id: idx.toString(),
            birth: birth?.toLocaleString() || "",
            isLeader: role !== parseEnumKey(TeamRole, TeamRole.NormalMember),
          };
        })
      );
    }
  }, [team.members]);

  const teamMemberTableFeature = {
    addNewMember: () => {
      setTeam({
        ...team,
        members: [...team.members, { ...member }],
      });
    },
    importNewMembers: () => {},
    downloadExample: () => {},
    exportMembersAsExcel: () => {}
  }

  const renderTab = (label: string) => {
    switch (label) {
      case finalPlanType.teamMemberList:
        return (
          <TeamMember
            rowsProp={tmfake.rowsHeader}
            dataProp={teamMembers}
            feature={teamMemberTableFeature}
          />
        );
      case finalPlanType.personalItemList:
        return (
          <ItemList key="personal"/>
        );
      case finalPlanType.teamItemList:
        return (
          <ItemList key="team" isTeam/>
        );
      case finalPlanType.route:
        return (
          <RoutePlan />
        )
      case finalPlanType.BPlan:
        return (
          <div className="w-full p-5 flex gap-y-5 flex-col justify-start">
            <div className="w-full flex flex-col">
              <label className="text-2xl mb-2">撤退計畫</label>
              <textarea
                className="p-3"
                rows={20}
                placeholder={"輸入你的撤退計畫"}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="text-2xl mb-2">拆隊計畫</label>
              <textarea
                className="p-3"
                rows={20}
                placeholder={"輸入你的拆隊計畫"}
              />
            </div>
          </div>
        );
      case finalPlanType.map:
        return (
          <div className="w-full h-screen p-3">
            <iframe
              src="https://twmap.happyman.idv.tw/map/"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Taiwan Map"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );
      case finalPlanType.other:
        return (
          <div className="w-full p-5 flex gap-y-5 flex-col justify-start">
            {
              ["水源", "交通", "訊號", "最近醫療站"].map((item, idx) => {
                return (
                  <div key={idx} className="w-full flex flex-col">
                    <label className="text-2xl mb-2">{item}</label>
                    <textarea
                      className="p-3"
                      rows={5}
                      placeholder={`關於${item}`}
                    />
                  </div>
                );
              })
            }
          </div>
        );
      default:
        return (
          <div className="flex flex-col text-center gap-y-5 ">
            <p className="text-5xl">{label}</p>
            <p className="text-red-600 text-xl">尚未開放</p>
          </div>
        );
    }
  }

  return (
    <div className={`flex w-full flex-col justify-center items-center gap-y-5`}>
      <div
        className={`${
          styles.tabContainer
        } flex w-full justify-center items-center gap-x-10 pl-5 pr-5 py-2  transition-transform duration-500
        `}
      >
        {tabs.map((tab, idx) => {
          return (
            <div
              key={idx}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              style={{ minWidth: "100px" }}
              className={`${idx !== selectedTab && "cursor-pointer"} ${
                idx === selectedTab && styles.active
              } text-center`}
              onClick={() => setSelectedTab(idx)}
            >
              {tab.label}
            </div>
          );
        })}
        <div
          className={styles.activeTab}
          style={{
            width: `${indicatorStyle.width + 20}px`,
            transform: `translateX(${indicatorStyle.x - 10}px)`,
          }}
        />
      </div>
      <div
        className={`w-full min-h-screen mb-10 flex justify-center items-center ${styles.contentContainer}`}
      >
        {renderTab(tabs[selectedTab].label)}
      </div>
    </div>
  );
};

export default Page;
