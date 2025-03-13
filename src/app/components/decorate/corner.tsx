import Image, { StaticImageData } from 'next/image';

const ImageCorner = ({ source }: {
    source: string | StaticImageData;
    alt: string
}) => {
    return (
        <div className='relative'>
            <div
                className='absolute w-0 h-0 border-solid'
                style={{
                    top: '-10px',
                    left: '-10px',
                    borderColor: 'var(--main-color2) transparent transparent transparent',
                    borderWidth: '50px 50px 0 0',
                }}
            />
            <div className='absolute w-0 h-0'
                style={{
                    bottom: '-10px',
                    right: '-10px',
                    borderColor: 'transparent transparent var(--main-color2) transparent',
                    borderWidth: '0 0 50px 50px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 6px 4px 6px 0px'
                }}
            />
            <Image src={source} alt='' width={300} />
        </div>
    )
}

export default ImageCorner;