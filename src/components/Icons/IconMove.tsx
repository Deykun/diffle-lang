type Props = {
  className?: string,
};

const IconMove = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 10c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-3.857 3C8.059 12.679 8 12.348 8 12s.059-.679.143-1H6V7l-6 5 6 5v-4h2.143zm7.714-2c.084.321.143.652.143 1s-.059.679-.143 1H18v4l6-5-6-5v4h-2.143z" />
    </svg>
);

export default IconMove;
