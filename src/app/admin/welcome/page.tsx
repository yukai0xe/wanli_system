'use client'
// import { useState, useEffect } from "react";
import Logo from "@/assets/logo2.png";
import Image from "next/image";
import { useUserStore } from "@/state/store";

const MainPage = () => {
  const username = useUserStore((state: UserState) => state.username);
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-y-10">
      <Image style={{ width: "200px", height: "200px" }} src={Logo} alt="" />
      <h1 className="text-5xl">歡迎~ {username}</h1>
    </div>
  );
}

export default MainPage;