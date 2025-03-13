'use client';
import Image from "next/image"
import Image1 from "@/assets/images/2.jpg"
import { Button1 } from "@/app/components/button"
import { useRouter } from "next/navigation"

const teams: team.TeamType[] = [
    {
        id: "1",
        name: "Team 1",
        tags: ["tag1", "tag2"],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien fermentum tincidunt. Nullam nec nunc nec nunc ultriciesLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien fermentum tincidunt. Nullam nec nunc nec nunc ultricies",
        date: new Date(),
        count: 15,
        image: Image1
    },
    {
        id: "2",
        name: "Team 2",
        tags: ["tag1", "tag2"],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien fermentum tincidunt. Nullam nec nunc nec nunc ultriciesLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien fermentum tincidunt. Nullam nec nunc nec nunc ultricies",
        date: new Date(),
        count: 0,
        image: Image1
    }
]

const TeamView = ({ team }: { team: team.TeamType }) => {
    const date = team.date.getFullYear() + "/" + (team.date.getMonth() < 10 && "0") + (team.date.getMonth() + 1) + "/" + (team.date.getMonth() < 10 && "0") + team.date.getDate();

    const router = useRouter();

    const toRecord = () => {
        router.push(`/team/${team.id}`);
    };

    const toGallery = () => {
        router.push(`/team/${team.id}/photos`);
    };

    return (
        <section className="flex align-center gap-8 justify-center mb-10" style={{maxHeight: '400px'}}>
            <Image src={team.image} alt="team" width={600} style={{objectFit: 'cover'}} />
            <div className="w-1/3 flex justify-start flex-col gap-4 pt-10">
                <h2 className="font-bold text-2xl">{team.name}</h2>
                <p className="flex gap-4">
                    {
                        [...team.tags, date , team.count + "人"].map((data, index) => {
                            return <span key={index}>{data}</span>
                        })
                    }
                </p>
                <p>{team.content}</p>
                <div className="flex gap-4 flex-col align-left w-1/3">
                    <Button1 name="行程記錄" handleClick={toRecord} style={{fontWeight: 'bold'}} />
                    <Button1 name="相關照片" handleClick={toGallery} style={{fontWeight: 'bold'}} />
                </div>
            </div>
        </section>
    )
}

const Team = () => {
    return (
        <>
            {
                teams.map((team) => {
                    return <TeamView key={team.id} team={team} />
                })
            }
        </>
    )
}

export default Team;