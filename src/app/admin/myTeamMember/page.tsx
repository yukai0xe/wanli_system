'use client'
// import { useState, useEffect } from "react";
import { useUserStore } from "@/state/store";

const MainPage = () => {
  const username = useUserStore((state: UserState) => state.username);

  return (
   <div className="flex flex-col w-full justify-center items-center gap-y-10">
      <h1 className="text-5xl">歡迎~ {username}</h1>
    </div>
  )
}

export default MainPage;