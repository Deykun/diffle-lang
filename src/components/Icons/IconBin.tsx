interface Props {
    className?: string,
}

const IconBin = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
        <path d="M19 24H5c-1.104 0-2-.896-2-2V6h18v16c0 1.104-.896 2-2 2zm-7-10.414 3.293-3.293 1.414 1.414L13.414 15l3.293 3.293-1.414 1.414L12 16.414l-3.293 3.293-1.414-1.414L10.586 15l-3.293-3.293 1.414-1.414L12 13.586zM22 5H2V3h6V1.5C8 .673 8.673 0 9.5 0h5c.825 0 1.5.671 1.5 1.5V3h6v2zm-8-3h-4v1h4V2z"/>
    </svg>
);

export default IconBin;
