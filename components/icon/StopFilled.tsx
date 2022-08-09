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
            <path d="M512 42.667C771.2 42.667 981.333 252.8 981.333 512S771.2 981.333 512 981.333 42.667 771.2 42.667 512 252.8 42.667 512 42.667zM211.797 196.693l-15.061 15.104a21.333 21.333 0 0 0 0 30.166l585.301 585.344a21.333 21.333 0 0 0 30.166 0l15.061-15.062a21.333 21.333 0 0 0 0-30.165L241.963 196.693a21.333 21.333 0 0 0-30.166 0z" />
        </svg>
    </IconWrapper>
);
