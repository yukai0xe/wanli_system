'use client';
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const Page = ({ children }: {
  children: React.ReactNode,
}) => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchTeam() {
      const state = usePlanTeamStore.getState();
      if (state.getTeamWithFetch) {
        await state.getTeamWithFetch(Number(id));
      }
    }
    fetchTeam();
  }, []);

  return <div className="pl-10 pr-10 pt-10">{children}</div>;
};

export default Page;
