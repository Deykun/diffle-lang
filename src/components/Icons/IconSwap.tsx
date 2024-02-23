interface Props {
  className?: string,
}

const IconSwap = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 25 24">
        <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2c5.519 0 10 4.481 10 10s-4.481 10-10 10S2 17.519 2 12 6.481 2 12 2zm2 12v-3l5 4-5 4v-3H5v-2h9zm-4-6V5L5 9l5 4v-3h9V8h-9z" />
    </svg>
);

export default IconSwap;
