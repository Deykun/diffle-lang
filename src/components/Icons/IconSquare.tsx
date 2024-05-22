type Props = {
  className?: string,
};

const IconSquare = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
        <path d="M24 24H0V0h24v24zM2 2v20h20V2H2z" />
    </svg>
);

export default IconSquare;
