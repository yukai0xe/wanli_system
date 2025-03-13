import Collapse from '@/app/components/collapse';

const data = [
    { id: 1, title: "What is the purpose of this website?", content: "This website is a template for a Next.js app with Tailwind CSS and TypeScript." },
    { id: 2, title: "What is Next.js?", content: "Next.js is a React framework that enables server-side rendering, static site generation, and more." },
    { id: 3, title: "What is Tailwind CSS?", content: "Tailwind CSS is a utility-first CSS framework that helps you build designs without writing custom CSS." },
    { id: 4, title: "What is TypeScript?", content: "TypeScript is a superset of JavaScript that adds static types to the language." },
]

const Faq = () => {
    return (
        <>
            <div className='w-2/3'>
                {data.map((item) => (
                    <Collapse key={item.id} props={item}>
                        <p className='py-5'>{item.content}</p>
                    </Collapse>
                ))}
            </div>
        </>
    )
}

export default Faq;