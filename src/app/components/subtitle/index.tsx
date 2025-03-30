'use client';

const Subtitle = ({ title }: Readonly< {
    title: string;
} >) => {
    return (
        <div className="w-full justify-between flex items-center pb-10">
            <svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="20" width="510" height="15" fill="#ff6f61"/>
                <rect x="0" y="40" width="520" height="15" fill="#ff6f61"/>
                <rect x="0" y="60" width="530" height="15" fill="#ff6f61"/>
                <path d="M 0 85 L 450 85 L 470 45 L 490 70 L 510 20 L 540 85" fill="transparent" stroke="royalblue" strokeWidth="10"/>
            </svg>
            <h2 style={{'fontSize': '2rem'}}>{title}</h2>
            <svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(-1, 1) translate(-600, 0)">
                    <rect x="0" y="20" width="510" height="15" fill="#ff6f61"/>
                    <rect x="0" y="40" width="520" height="15" fill="#ff6f61"/>
                    <rect x="0" y="60" width="530" height="15" fill="#ff6f61"/>
                    <path d="M 0 85 L 450 85 L 470 45 L 490 70 L 510 20 L 540 85" fill="transparent" stroke="royalblue" strokeWidth="10"/>
                </g>
            </svg>
        </div>
    )
}

export default Subtitle;