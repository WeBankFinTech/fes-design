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
            <path d="M738.816 413.141A17.067 17.067 0 0 0 726.741 384H297.173a17.067 17.067 0 0 0-12.074 29.141l214.528 214.784a17.067 17.067 0 0 0 21.461 2.219l2.688-2.219 215.04-214.784z" />
        </svg>
    </IconWrapper>
);
