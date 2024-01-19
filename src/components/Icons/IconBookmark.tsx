interface Props {
    className?: string,
}

const IconBookmark = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m19 24-5-4.39L9 24V4h10v20zM7 2h8V0H5v20l2-1.756V2z"/>
    </svg>
);

export default IconBookmark;
