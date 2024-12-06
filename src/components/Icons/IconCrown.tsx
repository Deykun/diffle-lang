type Props = {
  className?: string,
};

const IconCrown = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M22 7c-1.326 0-2.294 1.272-1.924 2.54.312 1.07-1.36 2.111-3.206 2.111-1.761 0-3.678-.946-4.18-3.715-.262-1.444.021-1.823.728-2.532.359-.36.582-.855.582-1.404 0-1.104-.896-2-2-2s-2 .896-2 2c0 .549.223 1.045.582 1.403.706.71.989 1.089.728 2.532-.502 2.77-2.419 3.716-4.179 3.716-1.846 0-3.52-1.042-3.207-2.111C4.294 8.272 3.326 7 2 7 .896 7 0 7.896 0 9c0 1.202 1.061 2.149 2.273 1.98C3.5 10.811 5 14.741 5 22h14c0-7.217 1.494-11.189 2.727-11.019C22.92 11.149 24 10.219 24 9c0-1.104-.896-2-2-2zm-10 4.337c1.379 1.809 3.632 2.553 5.835 2.247-.331 1.202-.534 2.431-.656 3.417H6.822c-.123-.985-.325-2.214-.656-3.416 2.168.304 4.442-.42 5.834-2.248zM17 20H7v-1h10v1z" />
    </svg>
);

export default IconCrown;
