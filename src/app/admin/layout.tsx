"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/assets/styles/dashboardLayout.module.css";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore, useViewState } from "@/state/store";
import Image from "next/image";
import { usePlanTeamStore } from "@/state/planTeamStore";
import Logo from "@/assets/logo2.png";
import {
  HiOutlineArrowRightEndOnRectangle,
  HiHome,
  HiArrowLeft,
  HiArrowRight
} from "react-icons/hi2";
import { GiMountaintop } from "react-icons/gi";
import { PiPersonSimpleHikeFill } from "react-icons/pi";
import { FaFileInvoice } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";
import { FaGear } from "react-icons/fa6";

export const prefixUrl = "/admin";

const EntryPage = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { setLoading } = useViewState();
  const loading = useViewState(state => state.loading);
  const username = useUserStore(state => state.username);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      if(!username) setLoading(true);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem("access_token");
        router.replace("/wanli/admin");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem("access_token", session.access_token);
      } else {
        localStorage.removeItem("access_token");
        router.push("/wanli/admin");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUsername = useUserStore((state) => state.setUsername);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");
    fetch("/api/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No profile found");
        return res.json() ?? { username: null };
      })
      .then(({ username }) => {
        if (!username) throw new Error("Missing username");
        setUsername(username);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        router.push("/wanli");
        // if (error instanceof Error) alert(`讀取失敗: ${error.message}`);
        // else alert("讀取失敗: 發生未知錯誤");
      })
  }, []);

  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 5 ? "" : prev + "."));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full h-dvh flex justify-center items-center gap-x-5">
          <Image
            className="animate-fade"
            style={{ width: "200px", height: "200px" }}
            src={Logo}
            alt=""
          />
          <div className="text-xl">正在找路中{dots}</div>
        </div>
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  );
};

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {

  const [bars, setBars] = useState<{ width: number; height: number }[]>([]);
  const router = useRouter();
  const pathname = usePathname().split("/");
  const lastPathname = pathname.pop();
  const username = useUserStore((state) => state.username);
  const team = usePlanTeamStore((state) => state.team);
  const teamId = usePlanTeamStore((state) => state.id);
  const [title, setTitle] = useState<string>("");
  const [isFold, setIsFold] = useState<boolean>(false);
  const [showLeftSide, setShowLeftSide] = useState<boolean>(true);
  const navberModel = [
    {
      id: 1,
      displayText: "隊伍管理",
      path: prefixUrl + "/myTeam",
    },
    {
      id: 2,
      displayText: "隊員紀錄",
      path: prefixUrl + "/myTeamMember",
    },
    {
      id: 3,
      displayText: "檔案管理",
      path: prefixUrl + "/fileTemplate",
    },
  ];

  const teamLeftBarModel = [
    {
      id: 1,
      displayText: "隊伍首頁",
      path: prefixUrl + "/myTeam/"
    },
    {
      id: 2,
      displayText: "行前會模板",
      path: prefixUrl + "/myTeam/" + teamId + "/firstMeeting"
    },
    {
      id: 3,
      displayText: "留守計劃書",
      path: prefixUrl + "/myTeam/" + teamId + "/finalCheck"
    },
    {
      id: 4,
      displayText: "公裝分配",
      path: prefixUrl + "/myTeam/" + teamId + "/finalCheck/allocation"
    }
  ];

  const renderIcon = (id: number) => {
    switch (id) {
      case 1:
        return <GiMountaintop className="size-8" />;
      case 2:
        return <PiPersonSimpleHikeFill className="size-8" />;
      case 3:
        return <FaFileInvoice className="size-8" />;
    }
  }

  useEffect(() => {
    const newBars = Array.from({ length: 5 }).map(() => {
      const height = Math.floor(Math.random() * 6) + 10; // 10 ~ 20
      const width = Math.floor(Math.random() * 11) + 400; // 400 ~ 550
      return { width, height };
    });
    setBars(newBars);
  }, []);

  useEffect(() => {
    let teamPrefix = "";
    if (team.startDate !== team.endDate) teamPrefix = `${String(team.startDate).split("T")[0]} ~ ${String(team.endDate).split("T")[0]} ${team.mainName}`;
    else teamPrefix = `${String(team.startDate).split("T")[0]} ${team.mainName}`;

    if (lastPathname && /^\d+$/.test(lastPathname)) {
      if (team.startDate !== team.endDate) setTitle(`${teamPrefix} 出隊紀錄`);
      else setTitle(`${teamPrefix} 出隊紀錄`);
    } else {
      switch (lastPathname) {
        case "myTeam":
          setTitle(`${username} 的所有隊伍`);
          break;
        case "myTeamMember":
          setTitle(`${username} 的所有隊伍成員(含過去)`);
          break;
        case "firstMeeting":
          setTitle(`${teamPrefix} 行前會`);
          break;
        case "finalCheck":
          setTitle(`${teamPrefix} 留守計劃書`);
          break;
        case "allocation":
          setTitle(`${teamPrefix} 公裝分配`);
          break;
      }
    }

    if (pathname.length > 3) {
      setIsFold(true);
      setShowLeftSide(false);
    } else {
      setShowLeftSide(true);
    }
  }, [lastPathname, team])

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className={`${styles.quickLinkContainer}`}>
        <div
          className={`${
            showLeftSide ? "w-5/6" : "w-full"
          } flex justify-end items-center`}
        >
          {pathname.length > 3 && (
            <MdListAlt
              onClick={() => setIsFold(false)}
              title={"展開左側導覽列"}
              className="size-10 cursor-pointer hover:bg-yellow-100 rounded p-2 transition"
            />
          )}
          <span className="mr-auto ml-5">{title}</span>
          <div className="flex gap-x-2 items-center">
            <span>歡迎~ {username}</span>
            <HiOutlineArrowRightEndOnRectangle
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/wanli/admin");
              }}
              title="登出"
              className="size-10 cursor-pointer rounded p-2 hover:bg-yellow-100 transition"
            />
            <HiHome
              onClick={() => {
                router.push("/wanli");
              }}
              title="回到首頁"
              className="size-10 cursor-pointer hover:bg-yellow-100 rounded p-2 transition"
            />
            {pathname.length > 3 && team != null && (
              <FaGear
                title="隊伍設定"
                className="size-10 cursor-pointer hover:rotate-90 transition p-2 duration-1000"
              />
            )}
          </div>
        </div>
      </div>
      {showLeftSide ? (
        <aside
          className={`${
            styles.containerAside
          } w-[200px] absolute h-full transition-transform duration-200 ease-in-out shrink-0 ${
            isFold ? "-translate-x-[80%]" : "translate-x-0"
          }`}
        >
          <div className={styles.decorationBarContainer}>
            {bars.length === 0
              ? null
              : bars.map(({ width, height }, idx) => (
                  <div
                    key={idx}
                    className={`${styles.decorationBar} ${
                      idx % 2 === 0 ? styles.odd : styles.even
                    }`}
                    style={{ width: `${width}px`, height: `${height}px` }}
                  ></div>
                ))}
          </div>
          <div className="relative w-full">
            <ul className={styles.asideList}>
              {navberModel.map((item) => {
                const isActive = item.path
                  .split("/")
                  .every((val, idx) => val === pathname[idx]);
                return (
                  <Link key={item.id} href={item.path}>
                    <li
                      className={`${styles.asideListItem} ${
                        isActive ? styles.click : ""
                      }`}
                    >
                      {renderIcon(item.id)}
                      {item.displayText}
                    </li>
                  </Link>
                );
              })}
              {isFold ? (
                <HiArrowRight
                  onClick={() => setIsFold(false)}
                  className="size-10 text-white font-bold mt-2 ml-auto cursor-pointer rounded-full p-2 transition hover:bg-gray-700 hover:text-gray-200 hover:translate-x-1"
                />
              ) : (
                <HiArrowLeft
                  onClick={() => setIsFold(true)}
                  className="size-10 text-white font-bold mt-2 ml-auto cursor-pointer rounded-full p-2 transition hover:bg-gray-700 hover:text-gray-200 hover:-translate-x-1"
                />
              )}
            </ul>
          </div>
        </aside>
      ) : (
        <aside
          className={`${
            styles.containerAside
          } w-[200px] absolute h-full transition-transform duration-200 ease-in-out shrink-0 ${
            isFold ? "-translate-x-[100%]" : "translate-x-0"
          }`}
        >
          <ul className="w-full flex flex-col gap-1">
            {teamLeftBarModel.map((item) => {
              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-center h-[60px] text-2xl text-white rounded-md transition hover:bg-rose-900 hover:scale-[0.90]
                      ${lastPathname === item.path.split('/').pop() ? "scale-[0.95] bg-rose-950" : ""}`}
                  >
                    {item.displayText}
                  </Link>
                </li>
              );
            })}

            <li className="flex justify-end mt-2">
              <HiArrowLeft
                  onClick={() => setIsFold((prev) => !prev)}
                className="size-10 text-white font-bold mt-2 ml-auto cursor-pointer rounded-full p-2 transition hover:-translate-x-1"
              />
            </li>
          </ul>
        </aside>
      )}
      <main
        className={`flex-1 overflow-y-scroll transition-ml duration-200 ease-in-out ${
          showLeftSide ? (!isFold ? "ml-[200px]" : "ml-[60px]") : ""
        }`}
        style={{ marginTop: "50px" }}
      >
        {children}
      </main>
    </div>
  );
}

export default EntryPage;
