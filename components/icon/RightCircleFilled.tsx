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
            <path d="M42.667 512C42.667 252.8 252.8 42.667 512 42.667S981.333 252.8 981.333 512 771.2 981.333 512 981.333 42.667 771.2 42.667 512zm317.738-184.832a21.333 21.333 0 0 0 5.888 26.667L570.197 512 366.251 670.165l-2.816 2.603a21.333 21.333 0 0 0-.939 27.307l13.056 16.853a21.333 21.333 0 0 0 29.952 3.797l247.339-191.872a21.333 21.333 0 0 0 0-33.706L405.504 303.275a21.333 21.333 0 0 0-29.952 3.797l-13.056 16.853z" />
        </svg>
    </IconWrapper>
);
