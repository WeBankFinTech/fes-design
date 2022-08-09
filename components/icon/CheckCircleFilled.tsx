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
            <path d="M512 42.667C771.2 42.667 981.333 252.8 981.333 512S771.2 981.333 512 981.333 42.667 771.2 42.667 512 252.8 42.667 512 42.667zm180.821 265.472a21.333 21.333 0 0 0-26.709 5.845l-220.16 283.733-88.064-113.493a21.333 21.333 0 0 0-29.91-3.755l-16.853 13.056a21.333 21.333 0 0 0-3.84 29.952l121.771 156.928a21.333 21.333 0 0 0 33.707 0l253.909-327.168a21.333 21.333 0 0 0-3.755-29.952l-16.853-13.056z" />
        </svg>
    </IconWrapper>
);
