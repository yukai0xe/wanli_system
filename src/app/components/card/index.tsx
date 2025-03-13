import Image from 'next/image';
import styles from "./style.module.css";

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