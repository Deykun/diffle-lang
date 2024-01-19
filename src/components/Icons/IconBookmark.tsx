interface Props {
    className?: string,
}

const IconBookmark = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m19 24-7-6-7 6V0h14v24z"/>
    </svg>
);

export default IconBookmark;
