import Image from 'next/image';
import Image1 from '@/assets/images/1.jpg';
import Image2 from '@/assets/images/2.jpg';
import Image3 from '@/assets/images/3.jpg';
import { Flag } from '@/app/components/decorate/flag';
import Link from 'next/link';

const quickLinks = [
    { title: '首頁', url: '/' },
    { title: '關於山社', url: '/about' },
    { title: '近期隊伍', url: '/team' },
    { title: 'FAQ', url: '/faq' },
]

const titles = ["逢甲萬里登山社", "其他連結", "近期活動"]
const about = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non"

const activities: FooterActivityType[] = [
    {"cover": Image1, "alt": "", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non"},
    {"cover": Image2, "alt": "", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non"},
    {"cover": Image3, "alt": "", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Excepteur sint occaecat cupidatat non"},
]

const Footer = () => {
    return (
        <footer className='w-full justify-center items-center gap-4 mt-10' style={{ backgroundColor: `var(--foreground)`, color: `var(--white)` }}>
            <Flag />
            <div className="p-10">
                <div className='flex justify-around gap-4 mb-8'>
                    <p className='w-2/5 text-2xl font-bold'>{titles[0]}</p>
                    <p className='w-1/5 text-2xl font-bold'>{titles[1]}</p>
                    <p className='w-2/5 text-2xl font-bold'>{titles[2]}</p>
                </div>
                <div className='flex justify-around gap-4'>
                    <div className='w-2/5'>
                        <p>{about}</p>
                    </div>
                    <div className='w-1/5 flex flex-col gap-8'>
                        {
                            quickLinks.map(({ title, url }) => (
                                <p key={`${title}${url}`} className='text-xl font-bold'>
                                    <Link href={url}>{ "> " } {title}</Link>
                                </p>
                            ))
                        }
                    </div>
                    <div className='w-2/5'>
                        {
                            activities.map((data, idx) => (
                                <div className='flex mb-5' key={`activity-${idx}`}>
                                    <Image width={100} height={100} style={{objectFit:"cover"}} src={data.cover} alt={data.alt} />
                                    <p className='pl-5 text-sm'>{data.description}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='w-full min-h-24 flex flex-col justify-center px-5' style={{ backgroundColor: `var(--black-2)` }}>
                <p>© Copyright YuKai0xe. All Rights Reserved</p>
                <p>Design By YuKai0xe.</p>
            </div>
        </footer>  
    );
}

export default Footer;