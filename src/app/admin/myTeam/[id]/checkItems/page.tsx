"use client";
// import { useState, useEffect } from "react";
import { usePlanTeamStore } from "@/state/planTeamStore";

const Page = () => {
    const team = usePlanTeamStore((state: PlanTeamState) => state.team);

    return (
      <div className="flex flex-col w-full justify-center items-center gap-y-10">
        <h1 className="text-5xl">{team.mainName} 裝備檢查</h1>
      </div>
    );
};

export default Page;
