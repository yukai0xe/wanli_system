'use client'
// import { useState, useEffect } from "react";
// import { useUserStore } from "@/state/store";
import styles from "@/assets/styles/teamMember.module.css"
import TeamMember from "@/app/admin/TeamMember";
import { teamMemberFakeData } from "@/lib/viewModel/tableData";

const MainPage = () => {
  // const username = useUserStore((state: UserState) => state.username);
  const { rowsHeader, rowsData } = teamMemberFakeData;
  return (
    <div className={`flex w-full flex-col justify-center items-center gap-y-5`}>
      <div
        className={`w-full min-h-screen mb-10 flex justify-center items-center ${styles.contentContainer}`}
      >
        <TeamMember rowsProp={rowsHeader} dataProp={rowsData} allTeamMember />
      </div>
    </div>
  );
}

export default MainPage;