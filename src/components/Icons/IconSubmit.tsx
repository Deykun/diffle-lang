type Props = {
  className?: string,
};

const IconSubmit = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m0 12 11 3.1L18 7l-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339L11 17.946v-.769l-2-.56V24l4.473-6.031L18 22l6-22z" />
    </svg>
);

export default IconSubmit;
