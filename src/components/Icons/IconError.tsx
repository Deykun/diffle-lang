interface Props {
    className?: string,
}

const IconError = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16.142 2 22 7.858v8.284L16.142 22H7.858L2 16.142V7.858L7.858 2h8.284zm.829-2H7.029L0 7.029v9.941L7.029 24h9.941L24 16.971V7.029L16.971 0zM8.489 16.992l3.518-3.568 3.554 3.521 1.431-1.43-3.566-3.523 3.535-3.568-1.431-1.432-3.539 3.583L8.41 7.118 6.992 8.536l3.585 3.473-3.507 3.566 1.419 1.417z"/>
    </svg>
);

export default IconError;
