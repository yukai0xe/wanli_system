"use client";
// import { useState, useEffect } from "react";
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useDraftTeamMemberStore } from "@/state/teamMemberStore";
import styles from "@/assets/styles/finalCheck.module.css"
import { useState, useRef, useEffect } from "react";
import TeamMember from "@/app/admin/TeamMember";
import ItemList from "@/app/admin/ItemList";
import { finalPlanType, TeamRole } from "@/types/enum";
import { teamMemberFakeData as tmfake, personalIteamListFakeData as pitemfake } from "@/lib/viewModel/tableData";
import { parseEnumKey } from "@/lib/utility";

const tabs = Object.values(finalPlanType).map((type) => {
  return {
    label: type,
    active: [finalPlanType.teamMemberList, finalPlanType.personalItemList, finalPlanType.teamItemList].includes(type)
  };
});

const Page = () => {
  const { setTeam, team } = usePlanTeamStore();
  const { member } = useDraftTeamMemberStore();
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0 });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [teamMembers, setTeamMembers] = useState<RowData[]>([]);

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
            id: idx,
            birth: birth?.toLocaleString() || "",
            isLeader: role !== parseEnumKey(TeamRole, TeamRole.NormalMember),
          };
        })
      );
    }
  }, [team.members])

  const teamMemberTableFeature = {
    addNewMember: () => {
      setTeam({
        ...team,
        members: [...team.members, { ...member }],
      });
    },
    importNewMembers: () => {},
    downloadExample: () => {},
    exportMembersAsPDF: () => {},
    exportMembersAsExcel: () => {}
  }

  const renderTab = (id: number) => {
    switch (id) {
      case 0:
        return (
          <TeamMember
            feature={teamMemberTableFeature}
            rowsProp={tmfake.rowsHeader}
            dataProp={teamMembers}
          />
        );
      case 1:
      case 2:
        return <ItemList rowsProp={pitemfake.rowsHeader} dataProp={pitemfake.rowsData} />;
    }
  }

  return (
    <div className={`flex w-full flex-col justify-center items-center gap-y-5`}>
      <div
        className={`${styles.tabContainer} flex w-full justify-center items-center gap-x-10 pl-5 pr-5 py-2`}
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
        { renderTab(selectedTab) }
        {!tabs[selectedTab].active && (
          <div className="flex flex-col text-center gap-y-5">
            <p className="text-5xl">{tabs[selectedTab].label}</p>
            <p className="text-red-600 text-xl">尚未開放</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
