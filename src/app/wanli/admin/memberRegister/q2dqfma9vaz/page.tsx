'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
  

    const validateRegister = () => {
      if (!username.trim()) {
          alert("請輸入使用者名稱");
          return false;
      }
      if (!reason.trim()) {
          alert("請輸入申請原因");
          setIsLoading(false);
          return false;
      }
      if (password.trim().length < 6) {
          alert("密碼長度至少為 6");
          setIsLoading(false);
          return false;
      }
      return true;
    }
    
    const handleAuth = async (e: React.FormEvent) => {
       e.preventDefault();
       setIsLoading(true);

       const email = `${username.trim()}@wanli.student.com`;

        if(validateRegister()) {
            const { error } = await supabase.auth.signUp({
              email, password
            });
            if (error) alert(error.message);
            else {
              alert("註冊成功！");
            }
        }

       setIsLoading(false);
     };
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">
        山社管理系統(註冊)
      </h1>
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
        <input
          type="text"
          placeholder="申請原因"
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleAuth}
            disabled={isLoading}
        >
          {isLoading ? "處理中..." : "註冊"}
        </button>
        <button
            type="button"
            className="bg-green-500 mt-2 text-black font-bold p-2 rounded"
            onClick={() => router.replace(`/wanli/admin?reason=${encodeURIComponent(reason)}`)}
          >
            切換到登入
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
