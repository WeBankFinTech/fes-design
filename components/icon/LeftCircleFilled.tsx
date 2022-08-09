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
            <path d="M981.333 512c0 259.2-210.133 469.333-469.333 469.333S42.667 771.2 42.667 512 252.8 42.667 512 42.667 981.333 252.8 981.333 512zM660.565 672.768l-2.858-2.603L453.803 512l203.946-158.165a21.333 21.333 0 0 0 5.846-26.667l-2.091-3.243-13.056-16.853a21.333 21.333 0 0 0-29.952-3.797L371.2 495.147a21.333 21.333 0 0 0 0 33.706l247.339 191.872a21.333 21.333 0 0 0 29.952-3.797l13.056-16.853a21.333 21.333 0 0 0-.939-27.307z" />
        </svg>
    </IconWrapper>
);
