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
            <path d="M709.419 865.536 275.37 528.896a21.333 21.333 0 0 1 0-33.75l434.048-336.682a21.333 21.333 0 0 1 29.952 3.755l13.056 16.896a21.333 21.333 0 0 1-.939 27.306l-2.859 2.603L358.016 512l390.613 302.933a21.333 21.333 0 0 1 5.888 26.71l-2.09 3.242-13.056 16.896a21.333 21.333 0 0 1-29.952 3.755z" />
        </svg>
    </IconWrapper>
);
