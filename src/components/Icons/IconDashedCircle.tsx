

interface Props {
    className: string,
}

const IconDashedCircle = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.344 19.442 4.158 21.07C1.853 19.075.316 16.22.051 13h2c.255 2.553 1.48 4.819 3.293 6.442zM21.949 13c-.256 2.56-1.487 4.831-3.308 6.455l1.183 1.631c2.315-1.997 3.858-4.858 4.125-8.086h-2zM2.051 11c.256-2.561 1.487-4.832 3.309-6.456L4.177 2.913C1.86 4.909.317 7.771.051 11h2zm4.927-7.633C8.455 2.503 10.168 2 12 2c1.839 0 3.558.507 5.039 1.377l1.183-1.624C16.405.648 14.281 0 12 0 9.728 0 7.61.644 5.799 1.741l1.179 1.626zm12.863-.438-1.186 1.628c1.813 1.624 3.039 3.889 3.294 6.443h2c-.265-3.221-1.802-6.076-4.108-8.071zm-2.817 17.703C15.546 21.496 13.832 22 12 22c-1.84 0-3.56-.508-5.042-1.378l-1.183 1.624C7.593 23.352 9.718 24 12 24c2.273 0 4.392-.644 6.203-1.742l-1.179-1.626z"/>
    </svg>
);

export default IconDashedCircle;
