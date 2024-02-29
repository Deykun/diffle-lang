interface Props {
  className?: string,
}

const IconZipper = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m17 3-2-1 1-2 2 1-1 2zm-1 1h-2v2h1l1-2zm-1 4h-2v2h2V8zM6 1l2-1 1 2-2 1-1-2zm3 5h1V4H8l1 2zm0 4h2V8H9v2zm8 9-2-7H9l-2 7c-1 3 2 5 5 5s6-2 5-5zm-8 1c0-3 6-3 6 0s-6 3-6 0z" />
    </svg>
);

export default IconZipper;
