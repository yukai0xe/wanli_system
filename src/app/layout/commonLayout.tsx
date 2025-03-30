'use client';
import { Button2 } from "@/app/components/button";
import { useRouter } from "next/navigation";
import Subtitle from "@/app/components/subtitle";

export default function CommonLayout({ children, title }: Readonly<{
    children: React.ReactNode;
    title: string;
}>) {
    const router = useRouter();
    const toHome = () => router.push("/");

    return (
        <main className="shared-layout flex flex-col items-center" style={{paddingTop: '100px', paddingBottom: '100px'}}>
            {/* <h1 className="w-full text-center font-bold mb-5 mt-10" style={{fontSize: '3rem'}}>{title}</h1> */}
            <Subtitle title={title} />
            {children}
            <Button2 name="回到首頁" handleClick={toHome} />
        </main>
    );
}