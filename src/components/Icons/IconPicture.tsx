type Props = {
  className?: string,
};

const IconPicture = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m14 9-2.519 4L9 11.04 4 18h16l-6-9zm8-5v16H2V4h20zm2-2H0v20h24V2zM4 8c0-1.104.896-2 2-2s2 .896 2 2c0 1.105-.896 2-2 2s-2-.895-2-2z" />
    </svg>
);

export default IconPicture;
