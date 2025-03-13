'use client';
import Link from "next/link";
import Image from 'next/image';
import Logo from "@/assets/logo.png";

const links = [
    { href: "/", label: "主頁" },
    { href: "/about", label: "關於山社" },
    { href: "/team", label: "近期隊伍" },
    { href: "/faq", label: "FAQ" },
]

const Navbar = () => {
    return (
        <nav className='w-full shadow-xl' style={{ backgroundColor: `var(--foreground)`, color: `var(--white)` }}>
            <div className="w-full flex items-center px-4 py-4">
                <Image src={Logo} alt="Logo" width={80} height={80} />
                <ul className="flex justify-between items-center py-4 mx-auto w-1/5">
                    {links.map(({ href, label }) => (
                        <li key={`${href}${label}`} className="text-xl font-bold">
                            <Link href={href}><p>{ label }</p></Link>
                        </li>
                    ))}
                </ul>
            </div>
            
        </nav>
    )
}

export default Navbar;