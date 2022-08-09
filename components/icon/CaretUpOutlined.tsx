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
            <path d="m523.776 396.075 215.04 214.784A17.067 17.067 0 0 1 726.741 640H297.173a17.067 17.067 0 0 1-12.074-29.141l214.528-214.784a17.067 17.067 0 0 1 21.461-2.219l2.688 2.219z" />
        </svg>
    </IconWrapper>
);
