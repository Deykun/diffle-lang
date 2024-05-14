type Props = {
  className?: string,
}

const IconCopy = ({ className }: Props) => (
    <svg className={className} lip-rule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18H3c-.48 0-1-.379-1-1V3c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1H7c-.48 0-1-.379-1-1zM7.5 7.5v13h13v-13zm9-1.5V3.5h-13v13H6V7c0-.481.38-1 1-1z" fillRule="nonzero" />
    </svg>
);

export default IconCopy;
