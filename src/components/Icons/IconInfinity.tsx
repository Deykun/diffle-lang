interface Props {
    className?: string,
}

const IconInfinity = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M18 13v5h-5l1.607-1.608C11.203 13.568 8.965 8 5.428 8c-2.113 0-3.479 1.578-3.479 4s1.365 4 3.479 4c1.664 0 2.86-1.068 4.015-2.392l1.244 1.561C9.188 16.7 7.637 18 5.428 18 2.231 18 0 15.545 0 12s2.231-6 5.428-6c4.839 0 7.34 6.449 10.591 8.981L18 13zm.57-7c-2.211 0-3.762 1.301-5.261 2.833l1.244 1.561C15.709 9.069 16.905 8 18.57 8c2.114 0 3.48 1.578 3.48 4 0 1.819-.771 3.162-2.051 3.718v2.099c2.412-.623 4-2.829 4-5.816C24 8.455 21.768 6 18.57 6z"/>
    </svg>
);

export default IconInfinity;
