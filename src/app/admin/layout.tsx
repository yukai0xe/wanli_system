"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/assets/styles/dashboardLayout.module.css";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore, useViewState } from "@/state/store";
import Image from "next/image";

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
        router.replace("/wanli");
      }
    };
    checkSession();
  }, [router]);

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

  return <>{loading ? "This is Loading" : <DashboardLayout>{ children }</DashboardLayout>}</>;
};

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {

  const [bars, setBars] = useState<{ width: number; height: number }[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const navberModel = [
    { id: 1, displayText: "隊伍管理", icon: '/goal-mountain.svg', path: prefixUrl + "/myTeam" },
    { id: 2, displayText: "隊員管理", icon: '/hiking.svg', path: prefixUrl + "/myTeamMember" },
  ];

  const bottomModel = [
    {
      id: 1,
      displayText: "登出",
      icon: "/leave.svg",
      handler: async () => {
        await supabase.auth.signOut();
        router.push("/wanli/admin");
      }
    },
    {
      id: 2,
      displayText: "回到主頁",
      icon: "/home.svg",
      handler: 
        async () => {
          router.push("/wanli");
        },
    },
  ];

  const username = useUserStore((state) => state.username);
  useEffect(() => {
    const newBars = Array.from({ length: 5 }).map(() => {
      const height = Math.floor(Math.random() * 6) + 10; // 10 ~ 20
      const width = Math.floor(Math.random() * 11) + 400; // 400 ~ 550
      return { width, height };
    });
    setBars(newBars);
  }, []);

  // logout
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem("access_token", session.access_token);
      } else {
        localStorage.removeItem("access_token");
        router.push("/wanli/admin")
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={styles.quickLinkContainer}>
        <span>歡迎~ { username }</span>
      </div>
      <aside className={styles.containerAside}>
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
        <ul className={styles.asideList}>
          {navberModel.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <li
                  className={`${styles.asideListItem} ${
                    isActive ? styles.click : ""
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.icon}
                    width={32}
                    height={32}
                  />
                  {item.displayText}
                </li>
              </Link>
            );
          })}
        </ul>
        <ul className={styles.asideBottomList}>
          {bottomModel.map((item) => (
            <button
              key={item.id}
              className={styles.asideBottomListItemContainer}
              onClick={(e) => {
                e.preventDefault();
                item.handler();
              }}
            >
              <li className={styles.asideBottomListItem}>
                <Image src={item.icon} alt={item.icon} width={32} height={32} />
                {item.displayText}
              </li>
            </button>
          ))}
        </ul>
      </aside>
      <main
        className="w-full overflow-y-scroll"
        style={{ marginTop: "50px" }}
      >
        {children}
      </main>
    </div>
  );
}

export default EntryPage;
