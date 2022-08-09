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
            <path d="m627.925 523.776-214.784 215.04A17.067 17.067 0 0 1 384 726.741V297.173a17.067 17.067 0 0 1 29.141-12.074l214.784 214.528a17.067 17.067 0 0 1 2.219 21.461l-2.219 2.688z" />
        </svg>
    </IconWrapper>
);
