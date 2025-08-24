'use client'
import Collapse from '@/app/components/collapse';
import CommonLayout from '@/app/layout/commonLayout';
import { useEffect, useState } from 'react';

const Faq = () => {
    const [questions, setQuestions] = useState<FaqType[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/faq');
            const data: FaqSchema[] = await res.json();
            setQuestions(data.map(item => ({
                id: item.id,
                title: item.question,
                content: item.answer
            })))
        };
        fetchData();
    }, []);

    return (
        <CommonLayout title="常見問題">
            <div className='w-2/3 mb-10'>
                {questions.map((item) => (
                    <Collapse key={item.id} props={item}>
                        <p className='py-5'>{item.content}</p>
                    </Collapse>
                ))}
            </div>
        </CommonLayout>
    )
}

export default Faq;