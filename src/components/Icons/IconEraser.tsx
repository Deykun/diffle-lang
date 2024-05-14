type Props = {
  className?: string,
}

const IconEraser = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
        <path d="M5.662 23 .293 17.635C.098 17.44 0 17.185 0 16.928c0-.256.098-.512.293-.707L15.222 1.293c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707L12.491 21h5.514v2H5.662zm3.657-2-5.486-5.486-1.419 1.414L6.49 21h2.829zm.456-11.429-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z" />
    </svg>
);

export default IconEraser;
