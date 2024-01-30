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
            <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667zM401.066667 292.693333a17.066667 17.066667 0 0 0-16.725334 13.653334L384 309.76v404.48a17.066667 17.066667 0 0 0 23.722667 15.701333l2.986666-1.706666 294.186667-202.453334a17.066667 17.066667 0 0 0 2.602667-25.898666l-2.645334-2.218667L410.709333 295.68a17.066667 17.066667 0 0 0-9.642666-2.986667z" />
        </svg>
    </IconWrapper>
);