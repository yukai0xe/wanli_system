import Image from 'next/image';
import styles from "./style.module.css";
import Link from 'next/link';

const Card = ({ data }: { data: CardType }) => {

    return (
        <Link href={`/team/${data.id}`}>
            <div className={styles.card}>
                <Image className='w-full' width={100} height={100} src={data.src} alt={''} />
                <div className="p-5">
                    <h3 className='text-xl mb-3'>{ data.title }</h3>
                    <p className='text-sm'>{ data.description }</p>
                </div>
            </div>
        </Link>
    )
}

export default Card;