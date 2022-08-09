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
            <path d="M544 117.333v362.624l362.667.043A21.333 21.333 0 0 1 928 501.333v21.334A21.333 21.333 0 0 1 906.667 544H544v362.667A21.333 21.333 0 0 1 522.667 928h-21.334A21.333 21.333 0 0 1 480 906.667V544H117.333A21.333 21.333 0 0 1 96 522.667v-21.334A21.333 21.333 0 0 1 117.333 480L480 479.957V117.333A21.333 21.333 0 0 1 501.333 96h21.334A21.333 21.333 0 0 1 544 117.333z" />
        </svg>
    </IconWrapper>
);
