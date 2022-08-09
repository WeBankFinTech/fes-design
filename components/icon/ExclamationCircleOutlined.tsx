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
            <path d="M512 42.667C771.2 42.667 981.333 252.8 981.333 512S771.2 981.333 512 981.333 42.667 771.2 42.667 512 252.8 42.667 512 42.667zm0 64a405.333 405.333 0 1 0 0 810.666 405.333 405.333 0 0 0 0-810.666zm0 562.474a42.667 42.667 0 1 1 0 85.334 42.667 42.667 0 0 1 0-85.334zm10.667-417.365A21.333 21.333 0 0 1 544 273.109v311.979a21.333 21.333 0 0 1-21.333 21.333h-21.334A21.333 21.333 0 0 1 480 585.088V273.067a21.333 21.333 0 0 1 21.333-21.334h21.334z" />
        </svg>
    </IconWrapper>
);
