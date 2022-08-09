import IconWrapper from './IconWrapper';
import type { IconProps } from './IconWrapper';
import './style';

export default (props?: IconProps) => (
    <IconWrapper {...props}>
        <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
        >
            <path d="m704.384 401.493 16.853-13.013a21.333 21.333 0 0 1 29.952 3.797l162.219 209.28a21.333 21.333 0 0 1-16.853 34.39H106.667a21.333 21.333 0 0 1-21.334-21.334V593.28a21.333 21.333 0 0 1 21.334-21.333H809.6L700.587 431.445a21.333 21.333 0 0 1 .938-27.306l2.859-2.603z" />
        </svg>
    </IconWrapper>
);
