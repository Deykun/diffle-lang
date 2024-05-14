type Props = {
  className?: string,
};

const IconPictures = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M1.859 6 1.37 4h21.256l-.491 2H1.859zM3.44 2l-.439-2h17.994l-.439 2H3.44zM24 18H0l2 6h20l2-6zM3.104 16l-.814-6h19.411l-.839 6h2.02L24 8H0l1.085 8h2.019zm2.784-3.995C5.839 11.45 6.307 11 6.931 11c.625 0 1.155.449 1.185 1.004.03.555-.438 1.005-1.044 1.005-.605 0-1.136-.449-1.184-1.004zm7.575-.224-1.824 2.68-1.813-1.312L7 16h10l-3.537-4.219z" />
    </svg>
);

export default IconPictures;
