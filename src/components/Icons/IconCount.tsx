interface Props {
    className?: string,
}

const IconCount = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
       <path d="M19 0H5C2.238 0 0 2.239 0 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zm3 7h-3v2h3v6h-6v2h6v2c0 1.654-1.346 3-3 3H5c-1.654 0-3-1.346-3-3v-2h2v-2H2V9h8V7H2V5c0-1.654 1.346-3 3-3h14c1.654 0 3 1.346 3 3v2zm-8 3c0 .552-.447 1-1 1s-1-.448-1-1V6c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1V6c0-.552.447-1 1-1s1 .448 1 1v4zm-9 8c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4z"/>
    </svg>  
);

export default IconCount;
