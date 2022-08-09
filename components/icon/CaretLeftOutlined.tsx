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
            <path d="m396.075 523.776 214.784 215.04A17.067 17.067 0 0 0 640 726.741V297.173a17.067 17.067 0 0 0-29.141-12.074L396.075 499.627a17.067 17.067 0 0 0-2.219 21.461l2.219 2.688z" />
        </svg>
    </IconWrapper>
);
