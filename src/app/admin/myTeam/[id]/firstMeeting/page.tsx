"use client";
// import { useState, useEffect } from "react";
import { Button1 } from "@/app/components/button";

const Page = () => {

    return (
      <div
        className={`flex w-full flex-col justify-center items-center gap-y-5`}
      >
        <Button1
          animate={false}
          style={{color: "var(--white-2)"}}
          handleClick={() => {}}
        >下載參考文件</Button1>
      </div>
    );
};

export default Page;
