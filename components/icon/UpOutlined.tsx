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
            <path d="m158.464 709.419 336.64-434.048a21.333 21.333 0 0 1 33.75 0l336.682 434.048a21.333 21.333 0 0 1-3.755 29.952l-16.896 13.056a21.333 21.333 0 0 1-27.306-.939l-2.603-2.859L512 358.016 209.067 748.629a21.333 21.333 0 0 1-26.71 5.888l-3.242-2.09-16.896-13.056a21.333 21.333 0 0 1-3.755-29.952z" />
        </svg>
    </IconWrapper>
);
