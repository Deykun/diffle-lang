type Props = {
  className?: string,
};

const IconPrivacy = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 2V0h18v2H3zM2 5V3h20v2H2zm10 11H6l1-2 1-1c-2-3-1-4 0-4 2 0 3 1 2 4l1 1 1 2zm7-5h-5v1h5v-1zm0-2h-5v1h5V9zm-1 4h-4v1h4v-1zm0 2h-4v1h4v-1zm6 3H0l2 6h20l2-6zM3 16 2 8h20l-1 8h2l1-10H0l1 10h2z" />
    </svg>
);

export default IconPrivacy;
