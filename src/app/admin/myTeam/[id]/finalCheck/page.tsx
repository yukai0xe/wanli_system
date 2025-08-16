"use client";
// import { useState, useEffect } from "react";
import { usePlanTeamStore } from "@/state/planTeamStore";
import styles from "@/assets/styles/finalCheck.module.css"
import { useState, useRef, useEffect } from "react";

const tabs = [
  {
    label: "隊員名單",
    active: false,
  },
  {
    label: "個人裝備表",
    active: false,
  },
  {
    label: "團體裝備表",
    active: false,
  },
  {
    label: "預計行程/參考行程",
    active: false,
  },
  {
    label: "糧單",
    active: false,
  },
  {
    label: "航跡圖",
    active: false,
  },
  {
    label: "撤退計畫",
    active: false,
  },
  {
    label: "拆隊計畫",
    active: false,
  },
  {
    label: "其他(水源、訊號、急救站、交通)",
    active: false,
  },
];

const Page = () => {
  const team = usePlanTeamStore((state: PlanTeamState) => state.team);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0 });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  console.log(team);
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
