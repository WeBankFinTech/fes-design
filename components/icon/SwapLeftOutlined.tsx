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
            <path d="m298.837 401.493-16.853-13.013a21.333 21.333 0 0 0-29.952 3.797L89.813 601.557a21.333 21.333 0 0 0 16.854 34.39h789.888a21.333 21.333 0 0 0 21.333-21.334V593.28a21.333 21.333 0 0 0-21.333-21.333H193.62l109.014-140.502a21.333 21.333 0 0 0-.939-27.306l-2.859-2.603z" />
        </svg>
    </IconWrapper>
);
