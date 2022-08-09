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
            <path d="M542.25 209.493 239.745 512l302.507 302.507a21.333 21.333 0 0 1 0 30.208l-15.104 15.061a21.333 21.333 0 0 1-30.166 0L164.267 527.104a21.333 21.333 0 0 1 0-30.208L496.98 164.224a21.333 21.333 0 0 1 30.166 0l15.104 15.061a21.333 21.333 0 0 1 0 30.166zm317.44 0L557.228 512l302.506 302.507a21.333 21.333 0 0 1 0 30.208l-15.061 15.061a21.333 21.333 0 0 1-30.165 0L481.792 527.104a21.333 21.333 0 0 1 0-30.208l332.715-332.63a21.333 21.333 0 0 1 30.165 0l15.104 15.062a21.333 21.333 0 0 1 0 30.165z" />
        </svg>
    </IconWrapper>
);
