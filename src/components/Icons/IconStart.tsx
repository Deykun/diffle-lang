type Props = {
  className?: string,
};

const IconStart = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle className="icon-inside" cx="12" cy="12" r="10" fill="transparent" />
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.326 18.266L12 15.952l-4.326 2.313.863-4.829L5 10.037l4.86-.671L12 4.951l2.14 4.415 4.86.671-3.537 3.4.863 4.829z" />
    </svg>
);

export default IconStart;
