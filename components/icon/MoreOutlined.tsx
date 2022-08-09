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
            <path d="M756.224 512a55.979 55.979 0 1 1 112 0 55.979 55.979 0 0 1-112 0zm-300.245 0a56.021 56.021 0 1 1 112.042 0 56.021 56.021 0 0 1-112.042 0zm-300.203 0a56.021 56.021 0 1 1 112 0 56.021 56.021 0 0 1-112 0z" />
        </svg>
    </IconWrapper>
);
