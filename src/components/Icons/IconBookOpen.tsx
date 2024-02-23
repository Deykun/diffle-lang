interface Props {
  className?: string,
}

const IconBookOpen = ({ className }: Props) => (
    <svg className={className} viewBox="0 0 24 24">
        <path d="M23 5v13.883L22 19V3c-3.895.119-7.505.762-10.002 2.316C9.502 3.762 5.896 3.119 2 3v16l-1-.117V5H0v15h9.057c1.479 0 1.641 1 2.941 1 1.304 0 1.461-1 2.942-1H24V5h-1zM11 18.645c-1.946-.772-4.137-1.269-7-1.484V5.11c2.352.197 4.996.675 7 1.922v11.613zm9-1.484c-2.863.215-5.054.712-7 1.484V7.032c2.004-1.247 4.648-1.725 7-1.922v12.051z" />
    </svg>
);

export default IconBookOpen;
