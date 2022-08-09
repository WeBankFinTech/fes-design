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
            <path d="M512 42.667C771.2 42.667 981.333 252.8 981.333 512S771.2 981.333 512 981.333 42.667 771.2 42.667 512 252.8 42.667 512 42.667zm0 64a405.333 405.333 0 1 0 0 810.666 405.333 405.333 0 0 0 0-810.666zM490.667 256.17A21.333 21.333 0 0 1 512 277.504l-.043 234.453 170.795.043a21.333 21.333 0 0 1 21.333 21.333v21.334A21.333 21.333 0 0 1 682.752 576H469.333A21.333 21.333 0 0 1 448 554.667V277.504a21.333 21.333 0 0 1 21.333-21.333h21.334z" />
        </svg>
    </IconWrapper>
);
