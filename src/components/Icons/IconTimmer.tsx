type Props = {
  className?: string,
};

const IconTimmer = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m15.91 13.34 2.636-4.026-.454-.406-3.673 3.099c-.675-.138-1.402.068-1.894.618-.736.823-.665 2.088.159 2.824.824.736 2.088.665 2.824-.159.492-.55.615-1.295.402-1.95zM12 2.694V0h4v2.694c-1.439-.243-2.592-.238-4 0zm8.851 2.064 1.407-1.407 1.414 1.414-1.321 1.321c-.462-.484-.964-.927-1.5-1.328zM2 9h8v2H2V9zm-2 4h8v2H0v-2zm3 4h7v2H3v-2zm21-3c0 5.523-4.477 10-10 10-2.79 0-5.3-1.155-7.111-3h3.28c1.138.631 2.439 1 3.831 1 4.411 0 8-3.589 8-8s-3.589-8-8-8c-1.392 0-2.693.369-3.831 1h-3.28C8.7 5.155 11.21 4 14 4c5.523 0 10 4.477 10 10z" />
    </svg>
);

export default IconTimmer;
