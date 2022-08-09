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
            <path d="M906.667 96A21.333 21.333 0 0 1 928 117.333v789.334A21.333 21.333 0 0 1 906.667 928H117.333A21.333 21.333 0 0 1 96 906.667V117.333A21.333 21.333 0 0 1 117.333 96h789.334zM864 160H160v704h704V160zM704 480a21.333 21.333 0 0 1 21.333 21.333v21.334A21.333 21.333 0 0 1 704 544H320a21.333 21.333 0 0 1-21.333-21.333v-21.334A21.333 21.333 0 0 1 320 480h384z" />
        </svg>
    </IconWrapper>
);
