'use client';
import { usePlanTeamStore } from "@/state/planTeamStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const Page = ({ children }: {
  children: React.ReactNode,
}) => {
  const { id } = useParams<{ id: string }>();
  const { setTeam } = usePlanTeamStore();

  useEffect(() => {
    async function fetchTeam() {
      const state = usePlanTeamStore.getState();
      if (state.getTeamWithFetch) {
        const team = await state.getTeamWithFetch(Number(id));
        setTeam(team);
      }
    }
    fetchTeam();
  }, []);

  return <div className="pl-20 pt-10">{children}</div>;
};

export default Page;
