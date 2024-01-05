interface Props {
    className?: string,
}

const IconCaretDown = ({ className }: Props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 24 24"
    >
        <path d="M16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755H7.75c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
    </svg>
);

export default IconCaretDown;
