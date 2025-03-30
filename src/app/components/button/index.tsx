import button1_styles from './button1.module.css';
import button2_styles from './button2.module.css';

const Button1 = ({ name, style, handleClick }: {
    name: string,
    style?: React.CSSProperties,
    handleClick?: () => void
}) => {
    return (
        <button
            className={`${button1_styles.button} ${button1_styles.secondary}`}
            aria-label="Bouton Secondaire"
            role="button"
            style={style}
            onClick={handleClick}
        >
            <i className="fas fa-share" aria-hidden="true"></i>
            <span>{name}</span>
        </button>
    )
}

const Button2 = ({ name, style, handleClick }: {
    name: string,
    style?: React.CSSProperties,
    handleClick?: () => void
}) => {
    return (
        <button
            className={`${button2_styles.button} ${button2_styles.default}`}
            style={{fontWeight: 'bold', fontSize: '1.3rem', width: '200px', marginTop: 'auto', ...style }}
            onClick={handleClick}
        >
            {name}
        </button>
    )
}

export { Button1, Button2 };