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
            <path d="M512 42.667C771.2 42.667 981.333 252.8 981.333 512S771.2 981.333 512 981.333 42.667 771.2 42.667 512 252.8 42.667 512 42.667zM106.667 512A405.333 405.333 0 0 0 512 917.333a403.755 403.755 0 0 0 263.083-96.981L203.648 248.917A403.755 403.755 0 0 0 106.667 512zM512 106.667a403.755 403.755 0 0 0-263.083 96.981l571.435 571.435A403.755 403.755 0 0 0 917.333 512 405.333 405.333 0 0 0 512 106.667z" />
        </svg>
    </IconWrapper>
);
