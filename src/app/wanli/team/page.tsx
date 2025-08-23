import Image from "next/image"
import { Button1 } from "@/app/components/button"
import CommonLayout from "@/app/layout/commonLayout";
import { WanliLink } from "@/app/wanli/page";

const TeamView = ({ team }: { team: Team }) => {
    const date = team.date.getFullYear() + "/" + (team.date.getMonth() < 10 && "0") + (team.date.getMonth() + 1) + "/" + (team.date.getMonth() < 10 && "0") + team.date.getDate();

    return (
      <section
        className="flex align-center gap-8 justify-center mb-10"
        style={{ maxHeight: "400px" }}
      >
        <Image
          src={"/" + team.image}
          alt="team"
          width={600}
          height={100}
          style={{ objectFit: "cover" }}
        />
        <div className="w-1/3 flex justify-start flex-col gap-4 pt-10">
          <h2 className="font-bold text-2xl">{team.name}</h2>
          <p className="flex gap-4">
            {[...team.tags, date, team.count + "人"].map((data, index) => {
              return <span key={index}>{data}</span>;
            })}
          </p>
          <p>{team.content}</p>
          <div className="flex gap-4 flex-col align-left w-1/3">
            <WanliLink href={`team/${team.id}`}>
              <Button1 style={{ fontWeight: "bold" }}>行程記錄</Button1>
            </WanliLink>
            <WanliLink href={`team/${team.id}/photos`}>
              <Button1 style={{ fontWeight: "bold" }}>
                相關照片
              </Button1>
            </WanliLink>
          </div>
        </div>
      </section>
    );
}

const Team = async () => {
    const teams: Team[] = []

    return (
        <CommonLayout title="隊伍回顧">
            {
                teams && teams.map((team) => {
                    return <TeamView key={team.id} team={team} />
                })
            }
        </CommonLayout>
    )
}

export default Team;