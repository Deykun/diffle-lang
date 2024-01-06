interface Props {
    className: string,
}

const IconMagic = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M6.215 15.873c-1.49.454-2.652 1.619-3.107 3.107-.456-1.489-1.62-2.653-3.108-3.108 1.488-.454 2.652-1.618 3.106-3.106.456 1.487 1.619 2.651 3.109 3.107zM3.724 1.723C2.898 1.471 2.252.826 2.001 0 1.749.825 1.104 1.471.279 1.723c.823.252 1.469.898 1.722 1.722.251-.825.897-1.471 1.723-1.722zm1.837 2.182.732.732c1.631-1.359 3.789-2.329 5.729-2.337-1.833.458-3.645 1.663-4.947 3.12l1.653 1.653C12.488 2.708 19.573 1.587 24 4 17.451-1.092 9.415.713 5.561 3.905zM3.814 4.987 7.35 8.522l12.664 12.652L17.188 24 .985 7.815l2.829-2.828zm-.002 1.412L2.398 7.814l3.537 3.537L7.35 9.937 3.812 6.399zm6.408 2.123c1.005.307 1.794 1.095 2.101 2.101.307-1.005 1.096-1.793 2.101-2.101-1.005-.308-1.794-1.095-2.101-2.101-.307 1.007-1.096 1.794-2.101 2.101z" />
    </svg>
);

export default IconMagic;
