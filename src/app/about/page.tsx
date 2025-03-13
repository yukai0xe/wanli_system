import Image from 'next/image';
import Image1 from '@/assets/images/1.jpg';

const about_content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tempora temporibus ducimus rerum odit ab obcaecati, explicabo qui aut ut iusto laboriosam enim, minus incidunt quas porro. Architecto, veritatis assumenda?";
const About = () => {
    return (
        <>
            <section className='flex items-center gap-8 justify-center mb-10'>
                <Image src={Image1} alt="about" width={600} style={{ objectFit: 'cover', maxWidth: '100%', height: '400px' }} />
                <p className='w-1/3'>{about_content}</p>
            </section>
        </>
    )
}

export default About;