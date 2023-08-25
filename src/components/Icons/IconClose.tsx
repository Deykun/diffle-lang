interface Props {
    className?: string,
}

const IconClose = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m20.197 2.837.867.867-8.21 8.291 8.308 8.202-.866.867-8.292-8.21-8.23 8.311-.84-.84 8.213-8.32-8.312-8.231.84-.84 8.319 8.212 8.203-8.309zM20.188 0l-8.212 8.318L3.666.114 0 3.781l8.321 8.24-8.207 8.313L3.781 24l8.237-8.318 8.285 8.204L24 20.188l-8.315-8.209 8.201-8.282L20.188 0z"/>
    </svg>  
);

export default IconClose;
