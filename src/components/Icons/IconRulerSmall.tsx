interface Props {
  className?: string,
}

const IconRulerSmall = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M24 3v5h-1V5h-2v3h-1V5h-2v5h-1V5h-2v3h-1V5h-2v3h-1V5H9v5H8V5H6v3H5V5H2v14h22v2H0V3h24zM10 17v-6H8.859c0 .91-.809 1.07-1.701 1.111v1h1.488V17H10zm5.078-.985v.958H19v-1.306h-1.826c.822-.74 1.722-1.627 1.722-2.782 0-1.146-.763-1.885-1.941-1.885-.642 0-1.288.204-1.833.656l.424 1.148c.352-.279.715-.524 1.168-.524.486 0 .754.255.754.717-.011.774-.861 1.527-2.39 3.018z" />
    </svg>
);

export default IconRulerSmall;
