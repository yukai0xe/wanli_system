'use client';
import {FlagBackground, FlagSkew } from "@/app/components/decorate/flag";
import Carousel from "@/app/components/carousel";
import { Button2 } from "@/app/components/button";
import ImageCorner from "@/app/components/decorate/corner";
import Image1 from "@/assets/images/1.jpg";
import Logo from "@/assets/logo2.png";
import { useRouter } from "next/navigation";
import Subtitle from "./components/subtitle";
import Collapse from '@/app/components/collapse';
import Card from '@/app/components/card';
import Image from 'next/image'
import { Background1 } from "@/app/components/background";
import localFont from 'next/font/local'

const myFont = localFont({ src: './fonts/QIJIC-Regular.ttf', weight: '100' });
const myFont2 = localFont({ src: './fonts/SeoulHangang-CEB-Regular.ttf', weight: '300' });

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

  const router = useRouter();

  const toAbout = () => {
    router.push("/about");
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
      <div className="w-1/3 flex flex-col gap-4 justify-between h-4/5"
        style={{
          transform: "translateY(70px)",
        }}
      >
        <div className="flex flex-col gap-4">
          <h2 className={myFont2.className} style={{fontSize: '2rem'}}>{about.title}</h2>
          <p>{about.summary}</p>
        </div>
        <Button2 name="了解更多" handleClick={toAbout} style={{
          width: '200px',
          marginTop: 'auto',
          fontWeight: 'bold'
        }} />
      </div>
      <ImageCorner source={Image1} alt="" />
      <FlagSkew skew={10} size={7} style={{ bottom: 0, right: 0, zIndex: -1 }} />
      <FlagSkew skew={-10} size={7} style={{bottom: 0, right: 0, zIndex: -1}} />
    </section>
  )
}

const TeamView = () => {

  const data = [
    {
      id: 1,
      title: "隊伍1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      src: Image1
    },
    {
      id: 2,
      title: "隊伍2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      src: Image1
    },
    {
      id: 3,
      title: "隊伍3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      src: Image1
    }
  ]

  const router = useRouter();

  const toTeam = () => {
    router.push("/team");
  }


  return (
    <section className="relative w-full flex flex-col items-center gap-8"
      style={{
        marginBottom: "300px"
      }}
    >
      <Subtitle title="隊伍回顧" />
      <div className="flex justify-center gap-8 flex-wrap mt-10">
        {data.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
      <Button2 name="更多隊伍" handleClick={toTeam}/>
      <div className="w-full relative h-48">
        <Background1 style={{
          position: "absolute",
          zIndex: -1,
          bottom: 0,
          right: 0,
          filter: 'drop-shadow(0px 18px 6px rgb(52, 52, 52, 0.7))'
        }} />
        <FlagSkew skew={10} size={7} style={{bottom: 0, right: 0, zIndex: -2 }} />
        <FlagSkew skew={-10} size={7} style={{bottom: 0, right: 0, zIndex: -2}} />
      </div>
    </section>
  )
}

const FAQView = () => {
  const data = [
    { id: 1, title: "What is the purpose of this website?", content: "This website is a template for a Next.js app with Tailwind CSS and TypeScript." },
    { id: 2, title: "What is Next.js?", content: "Next.js is a React framework that enables server-side rendering, static site generation, and more." },
    { id: 3, title: "What is Tailwind CSS?", content: "Tailwind CSS is a utility-first CSS framework that helps you build designs without writing custom CSS." },
    { id: 4, title: "What is TypeScript?", content: "TypeScript is a superset of JavaScript that adds static types to the language." },
  ]

  const router = useRouter();

  const toFAQ = () => {
    router.push("/faq");
  }

  return (
    <section className="w-full flex flex-col mb-10 pb-10 items-center gap-8 py-1">
      <Subtitle title="常見問題" />
      <div>
        {data.map((item) => (
          <Collapse key={item.id} props={item}>
            <p className='py-5'>{item.content}</p>
          </Collapse>
      ))}
      </div>
      <Button2 name="更多問題" handleClick={toFAQ}/>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Carousel />
      <SlogonView />
      <AboutView />
      <TeamView />
      <FAQView />
    </> 
  );
}
