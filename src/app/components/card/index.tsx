import Image, { StaticImageData } from 'next/image';
import styles from "./style.module.css";

type CardType = {
    id: number;
    src: string | StaticImageData;
    title: string;
    description: string;
}

const Card = ({data}: {data: CardType}) => {
    return (
        <div className={styles.card}>
            <Image className='w-full' src={data.src} alt={''} />
            <div className="p-10">
                <h3 className='text-xl mb-5'>{ data.title }</h3>
                <p className='text-sm'>{ data.description }</p>
            </div>
        </div>
    )
}

export default Card;