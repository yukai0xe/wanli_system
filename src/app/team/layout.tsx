"use client";
import DisplayLayout from "@/app/layout/displayLayout";
import { usePathname } from "next/navigation";

export default function TeamLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    if (pathname != "/team") {
        return (
            <DisplayLayout title="">
                {children}
            </DisplayLayout>
        );
    }

    return (
        <DisplayLayout title="近期隊伍">
            {children}
        </DisplayLayout>
    );
}