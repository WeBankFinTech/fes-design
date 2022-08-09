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
            <path d="M496.896 859.648a21.333 21.333 0 0 0 27.221 2.475l2.987-2.475 332.672-332.715a21.333 21.333 0 0 0 2.475-27.221l-2.475-2.987-15.061-15.061a21.333 21.333 0 0 0-27.222-2.475l-2.986 2.475L544 752.214V170.708a21.333 21.333 0 0 0-21.333-21.333h-21.334A21.333 21.333 0 0 0 480 170.709v581.547L209.493 481.664a21.333 21.333 0 0 0-27.221-2.475l-2.987 2.475-15.061 15.104a21.333 21.333 0 0 0-2.475 27.221l2.475 2.944 332.672 332.715z" />
        </svg>
    </IconWrapper>
);
