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
        <nav className='w-full shadow-xl fixed top-0' style={
            {
                backgroundColor: `var(--foreground)`,
                color: `var(--white)`,
                zIndex: 100,
                boxShadow: '0 -50px 0 0 var(--secondary-color), 0 8px 2px rgba(52, 52, 52, 0.5)'
            }}>
            <div className="w-full flex items-center px-4 py-4">
                <Image src={Logo} alt="Logo" width={80} height={80} />
                <ul className="flex justify-between items-center py-4 mx-auto w-1/5">
                    {links.map(({ href, label }) => (
                        <li key={`${href}${label}`} className="text-xl font-bold">
                            <Link href={href}><p>{ label }</p></Link>
                        </li>
                    ))}
                </ul>
                <Link href='/admin/'>
                    <span className="border p-5">
                        管理
                    </span>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;