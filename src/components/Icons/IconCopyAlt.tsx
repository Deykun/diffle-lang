type Props = {
  className?: string,
};

const IconCopyAlt = ({ className }: Props) => (
    <svg className={className} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18v3c0 .621.52 1 1 1h14c.478 0 1-.379 1-1V7c0-.478-.379-1-1-1h-3V3c0-.478-.379-1-1-1H3c-.62 0-1 .519-1 1v14c0 .621.52 1 1 1zM16.5 6H7c-.62 0-1 .519-1 1v9.5H3.5v-13h13z" fillRule="nonzero" />
    </svg>
);

export default IconCopyAlt;
