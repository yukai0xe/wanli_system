'use client';
import { ReactNode, useState } from 'react';
import styles from './style.module.css';


const Collapse = ({ children, props }: { children: ReactNode, props: {
        title: string;
        id: number;
    }}) => {
    const [active, setActive] = useState(false);

    return (
        <div className='pb-2'>
            <button className={`${styles.accordion} ${active && styles.active}`} onClick={() => setActive(!active)}>Question {props.id}: {props.title}</button>
            <div className={styles.panel} style={{height: active ? '500px' : '0px'}}>
                {children}
            </div>
        </div>
    )
}

export default Collapse;