interface Props {
  className?: string,
}

const IconShare = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25">
        <path d="M5 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm11.122 12.065c-.073.301-.122.611-.122.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.943 1.764l5.488 2.927zM24 4c0-2.209-1.791-4-4-4s-4 1.791-4 4c0 .324.049.634.122.935l-5.488 2.927c.395.535.713 1.127.943 1.764l5.488-2.927C17.796 7.494 18.835 8 20 8c2.209 0 4-1.791 4-4z" />
    </svg>
);

export default IconShare;
