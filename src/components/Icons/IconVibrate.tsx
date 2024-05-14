type Props = {
  className?: string,
}

const IconVibrate = ({ className }: Props) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M14 8v14H4V8h10zm2 0c0-1.104-.896-2-2-2H4c-1.104 0-2 .896-2 2v14c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2V8zM7 20H5v-1h2v1zm0-2H5v-1h2v1zm3 2H8v-1h2v1zm0-2H8v-1h2v1zm3 2h-2v-1h2v1zm0-2h-2v-1h2v1zm0-3H5v-5h8v5zm1-10.688c.944-.001 1.889.359 2.608 1.08.721.72 1.082 1.664 1.082 2.606h1.554c-.001-1.341-.514-2.684-1.538-3.707C16.681 3.269 15.341 2.758 14 2.759v1.553zm0-2.718c1.639-.001 3.277.623 4.53 1.874 1.251 1.25 1.877 2.892 1.878 4.531H22c-.001-2.047-.782-4.096-2.345-5.658C18.093.779 16.046 0 14 .001v1.593z" />
    </svg>
);

export default IconVibrate;
