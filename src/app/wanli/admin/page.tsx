"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin/welcome");
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = `${username.trim()}@wanli.student.com`;
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setIsLoading(false);
      return alert("登入失敗");
    } else {
      localStorage.setItem("access_token", accessToken);
      fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          reason,
        }),
      }).then(() => {
        alert("登入成功");
        router.push("/admin/welcome");
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">山社管理系統</h1>
      <form className="mt-4 flex flex-col">
        <input
          type="text"
          placeholder="輸入名稱"
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <input
          type="password"
          placeholder="輸入密碼"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? "處理中..." : "登入"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
