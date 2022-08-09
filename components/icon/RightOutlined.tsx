import IconWrapper from './IconWrapper';
import type { IconProps } from './IconWrapper';
import './style';

export default (props?: IconProps) => (
    <IconWrapper {...props}>
        <svg
            width="200"
            height="200"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="m314.581 865.536 434.048-336.64a21.333 21.333 0 0 0 0-33.75L314.581 158.465a21.333 21.333 0 0 0-29.952 3.755l-13.056 16.896a21.333 21.333 0 0 0 .939 27.306l2.859 2.603L665.984 512 275.371 814.933a21.333 21.333 0 0 0-5.888 26.71l2.09 3.242 13.056 16.896a21.333 21.333 0 0 0 29.952 3.755z" />
        </svg>
    </IconWrapper>
);
