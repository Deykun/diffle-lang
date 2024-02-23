interface Props {
  className?: string,
}

const IconCheckEnter = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11S0 18.075 0 12 4.925 1 11 1c2.347 0 4.518.741 6.304 1.993L15.882 4.45A8.944 8.944 0 0 0 11 3c-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136L11.5 11.806 7.657 8.192 4.562 11.29 11.5 18 24 5.263l-3.096-3.096z" />
    </svg>
);

export default IconCheckEnter;
