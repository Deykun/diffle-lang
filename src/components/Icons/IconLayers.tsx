interface Props {
    className?: string,
}

const IconLayers = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M4 17.162 2 18V5.028L14 0v2.507L4 6.697v10.465zM22 6l-12 5.028V24l12-5.028V6zM8 9.697l10-4.19V3L6 8.028V21l2-.838V9.697z"/>
    </svg>
);

export default IconLayers;
