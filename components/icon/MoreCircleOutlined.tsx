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
            <path d="M42.667 512C42.667 252.8 252.8 42.667 512 42.667S981.333 252.8 981.333 512 771.2 981.333 512 981.333 42.667 771.2 42.667 512zm64 0a405.333 405.333 0 1 0 810.666 0 405.333 405.333 0 0 0-810.666 0zm555.434 0a56.021 56.021 0 1 1 112 0 56.021 56.021 0 0 1-112 0zm-206.08 0a56.021 56.021 0 1 1 112 0 56.021 56.021 0 0 1-112.042 0zm-207.701 0a56.021 56.021 0 1 1 112 0 56.021 56.021 0 0 1-112 0z" />
        </svg>
    </IconWrapper>
);
