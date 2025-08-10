'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isLogin, setIsLogin] = useState(true);
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

        if (isLogin) {
          const { data } = await supabase.auth.signInWithPassword({
            email, password
          });

          const accessToken = data.session?.access_token;
          if (!accessToken) {
            setIsLoading(false);
            return alert("登入失敗");
          }
          else {
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
            }).then((res) => {
              console.log(res);
              alert("登入成功");
              router.push("/admin/welcome");
            });
          }
        } else if(validateRegister()) {
            const { data, error } = await supabase.auth.signUp({
                email, password
            });
            console.log("auth.uid", data.user);
            if (error) alert(error.message);
            else {
                alert("註冊成功！");
                setIsLogin(true);
            }
        }

       setIsLoading(false);
     };
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">
        {isLogin ? "山社管理系統" : "註冊"}
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
        {!isLogin && (
          <input
            type="text"
            placeholder="申請原因"
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded mb-4"
          />
        )}
        <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleAuth}
            disabled={isLoading}
        >
          {isLoading ? "處理中..." : isLogin ? "登入" : "註冊"}
        </button>
        <button
          type="button"
          className="bg-green-500 mt-2 text-black font-bold p-2 rounded"
          onClick={() => setIsLogin(!isLogin)}
        >
          切換到 {isLogin ? "註冊" : "登入"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
