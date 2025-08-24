'use client';
import { useRouter } from "next/navigation";
import { useUserStore, useViewState } from '@/state/store';
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuthGuard() {
  const router = useRouter();
  const setUsername = useUserStore((state) => state.setUsername);
  const setLoading = useViewState((state) => state.setLoading);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);

        // 1️⃣ 檢查現有 session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            await supabase.auth.signOut();
          localStorage.removeItem("access_token");
          router.replace("/wanli/admin");
          return;
        }

        localStorage.setItem("access_token", session.access_token);

        // 2️⃣ 檢查使用者是否在資料庫
        const res = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("No profile found");

        const { username } = (await res.json()) ?? { username: null };
        if (!username) throw new Error("Missing username");

        if (isMounted) {
          setUsername(username);
          setLoading(false);
        }
      } catch (err) {
        console.error("[AuthGuard Error]", err);
        await supabase.auth.signOut();
        localStorage.removeItem("access_token");
        router.replace("/wanli");
      }
    };

    initAuth();

    // 3️⃣ 監聽 session 狀態變化
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
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, setUsername, setLoading]);
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const accessToken = localStorage.getItem("access_token");

  try {
    const res = await fetch(`/api${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        await supabase.auth.signOut();
        localStorage.removeItem("access_token");
        window.location.href = "/wanli/admin";
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("[apiFetch Error]", error);

    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    window.location.href = "/wanli/admin";

    throw error;
  }
}
