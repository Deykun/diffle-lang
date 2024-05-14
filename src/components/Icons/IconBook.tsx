type Props = {
  className?: string,
};

const IconBook = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.495 2H22V0H5C3.343 0 2 1.343 2 3v18c0 1.657 1.343 3 3 3h17V4H5.495c-1.375 0-1.375-2 0-2zM6 6h14v16H6V6z" />
    </svg>
);

export default IconBook;
