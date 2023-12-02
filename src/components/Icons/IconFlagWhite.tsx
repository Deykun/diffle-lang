interface Props {
    className?: string,
}

const IconFlagWhite = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 18.292v1.834c.644.129 1.177.303 1.496.528.273.192.274.498 0 .69-1.494 1.053-7.498 1.054-8.993 0-.272-.191-.271-.499 0-.69.319-.225.852-.399 1.497-.528v-1.833c-2.363.481-4 1.511-4 2.707 0 1.657 3.134 3 7 3s7-1.343 7-3c0-1.196-1.637-2.226-4-2.708zm6.715-14.759C15.775 3.533 15.709 1 12.296 1c-.82 0-1.603.178-2.296.421V0H8v21h2v-9.625c.742-.383 1.586-.664 2.308-.664 3.223 0 3.676 2.41 6.549 2.41 1.856 0 3.144-1.189 3.144-1.189v-9.65c-.001 0-1.419 1.251-3.286 1.251zM20 10.853c-1.279.589-2.076.159-3.076-.531-.986-.679-2.336-1.61-4.616-1.61-.766 0-1.558.193-2.308.477V3.565c1.307-.692 2.984-.872 4.54.347C16.065 5.106 17.659 5.88 20 5.401v5.452z"/>
    </svg>
);

export default IconFlagWhite;
