'use client';
import { FlagBackground, FlagSkew } from "@/app/components/decorate/flag";
import WCarousel from "@/app/components/carousel";
import { Button2 } from "@/app/components/button";
import ImageCorner from "@/app/components/decorate/corner";
import Default from "@/assets/images/1.jpg";
import Logo from "@/assets/logo2.png";
import Subtitle from "@/app/components/subtitle";
import Collapse from '@/app/components/collapse';
import Card from '@/app/components/card';
import Image from 'next/image'
import Link from "next/link";
import { useEffect, useState } from "react";
import { myFont, myFont2 } from "@/assets/fonts/fonts";

const SlogonView = () => {
  return (
    <section className="relative w-full flex justify-center items-center gap-8 py-10 my-10"
      style={{
        marginTop: "100px",
        marginBottom: "100px"
      }}
    >
      <Image width={200} src={Logo} alt='' />
      <div className="flex justify-center items-center flex-col">
        <h1 className={`${myFont.className} text-center mb-5`} style={{fontSize: '3rem'}}>振衣千仞崗 濯足萬里流</h1>
        <h2 className={`${myFont.className} text-center`} style={{fontSize: '1.5rem'}}>看那旭日初昇 漫漫雲海湧動</h2>
        <h2 className={`${myFont.className} text-center`} style={{fontSize: '1.5rem'}}>聽那鳥鳴蟬唱 潺潺流水滑落</h2>
        <h2 className={`${myFont.className} text-center`} style={{fontSize: '1.5rem'}}>踏遍大小山岳 不畏艱難登上座座頂峰</h2>
        <h2 className={`${myFont.className} text-center`} style={{fontSize: '1.5rem'}}>交織著汗水與淚水 只為那瞬間的感動</h2>
      </div>
      <FlagBackground size={18} />
    </section>
  )
}

const AboutView = () => {
  const about = {
    title: "關於山社",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus egetLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus egetLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget"
  }

  return (
    <section
      className="relative w-full flex justify-center items-center gap-8 py-1 mt-10 h-96"
      style={{
        backgroundColor: "var(--main-color3)",
        borderTop: "20px solid var(--white)",
        borderBottom: "20px solid var(--white)",
        marginBottom: "300px",
        boxShadow: '0 -50px 0 0 var(--secondary-color), 0 8px 2px rgba(52, 52, 52, 0.3)',
      }}
    >
      <div className="w-1/3 flex flex-col gap-4 justify-between h-4/5">
        <div className="flex flex-col gap-4">
          <h2 className={myFont2.className} style={{fontSize: '2rem'}}>{about.title}</h2>
          <p>{about.summary}</p>
        </div>
        <WanliLink href="about">
          <Button2 name="了解更多" style={{
            width: '200px',
            marginTop: 'auto',
            fontWeight: 'bold',
            transform: 'scale(0.9)'
          }} />
        </WanliLink>
      </div>
      <ImageCorner source={Default} alt="" />
      <FlagSkew skew={10} size={7} style={{ bottom: 0, right: 0, zIndex: -1 }} />
      <FlagSkew skew={-10} size={7} style={{bottom: 0, right: 0, zIndex: -1}} />
    </section>
  )
}

const TeamView = () => {
  const [teams, setTeams] = useState<CardType[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/teams');
      const data = await res.json();
      const teams = data.map((team: TeamSchema) => ({
        id: team.id,
        title: team.name,
        description: team.content,
        src: '/' + team.image || Default
      }));
      setTeams(teams.slice(0, 3));
    }
    fetchData();
  }, []);

  return (
    <section className="relative w-full flex flex-col items-center gap-8"
      style={{
        marginBottom: "300px"
      }}
    >
      <Subtitle title="隊伍回顧" />
      <div className="flex justify-center gap-8 flex-wrap mt-10">
        {teams.map((item, index) => (
          <Card key={index} data={item}/>
        ))}
      </div>
      <WanliLink href="team">
        <Button2 name="更多隊伍"/>
      </WanliLink>
      <div className="w-full relative h-48">
        <Image src="/background.svg" alt="" width={100} height={100}
          style={{
            width: "100%",
            position: "absolute",
            zIndex: -1,
            bottom: 0,
            right: 0,
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0px 18px 6px rgb(52, 52, 52, 0.7))'
          }}
        />
        <FlagSkew skew={10} size={7} style={{bottom: 0, right: 0, zIndex: -2 }} />
        <FlagSkew skew={-10} size={7} style={{bottom: 0, right: 0, zIndex: -2}} />
      </div>
    </section>
  )
}

const FAQView = () => {
  const [questions, setQuestions] = useState<FaqType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/faq');
      const data: FaqSchema[] = await res.json();
      setQuestions(data.map(item => ({
        id: item.id,
        title: item.question,
        content: item.answer
      })))
    };
    fetchData();
  }, []);

  return (
    <section className="w-full flex flex-col mb-10 pb-10 items-center gap-8 py-1">
      <Subtitle title="常見問題" />
      <div>
        {questions.map((item) => (
          <Collapse key={item.id} props={item}>
            <p className='py-5'>{item.content}</p>
          </Collapse>
      ))}
      </div>
      <WanliLink href="faq">
        <Button2 name="更多問題"/>
      </WanliLink>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <WCarousel />
      <SlogonView />
      <AboutView />
      <TeamView />
      <FAQView />
    </> 
  );
}

type WanliLinkProps = {
  href: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">;

export function WanliLink({ href, children, ...props }: WanliLinkProps) {
  const base = "/wanli";
  return (
    <Link
      {...props}
      href={`${base}${href.startsWith("/") ? href : `/${href}`}`}
    >
      {children}
    </Link>
  );
}
