'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const FlagContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const FlagBar = styled.div<{ id: number }>`
    height: 30px;
    width: 100%;
    background-color: ${({id}) => (id % 2 === 0 ? 'var(--secondary-color)' : 'var(--white)')};
`;

const FlagRandomBar = styled.div<{ id: number, height: number, width: number }>`
    height: ${({ height }) => height}px;
    width: ${({ width }) => width}%;
    background-color: ${({ id }) => (id % 3 == 0 ? 'var(--secondary-color)' : ((id % 3 == 1 && id % 6 != 0) ? 'var(--main-color2)' : 'var(--white)'))};
`;


const Flag = () => {
    return (
        <FlagContainer>
           {[...Array(5)].map((_, index) => (
                <FlagBar key={index} id={index}></FlagBar>
            ))}
        </FlagContainer>
    );
}

const FlagBackground = ({size}: {size: number}) => {
    const [flagbars, setFlagBars] = useState<{
            h: number;
            w: number;
        }[]>([{h: 0, w: 0}]);

    useEffect(() => {
        const fl = [];
        for (let i = 0; i < size; i++) {
            if (i % 3 == 1 && i % 6 != 0) {
                fl.push({h: Math.floor(Math.random() * 11), w: Math.floor(Math.random() * (100 - 90 + 1)) + 90});
            }
            else {
                fl.push({h: Math.floor(Math.random() * (60 - 40 + 1)) + 40, w: Math.floor(Math.random() * (100 - 97 + 1)) + 97});
            }
        }
        setFlagBars(fl);
    }, []);

    return (
        <FlagContainer className='absolute w-full' style={{zIndex: -1}}>
           {flagbars.map((f, index) => (
                <FlagRandomBar key={index} id={index} height={f.h} width={f.w}></FlagRandomBar>
            ))}
        </FlagContainer>
    )
}

const FlagSkew = ({ size, skew, style }: { size: number, skew: number, style?: React.CSSProperties}) => {
    return (
        <div className="absolute w-full" style={{transform: `skewY(${skew}deg)`, ...style }}>
           {[...Array(size)].map((_, index) => (
                <FlagBar key={index} id={index}></FlagBar>
            ))}
        </div>
    );
}

export { Flag, FlagBackground, FlagSkew};