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
            <path d="M906.667 96A21.333 21.333 0 0 1 928 117.333v789.334A21.333 21.333 0 0 1 906.667 928H117.333A21.333 21.333 0 0 1 96 906.667V117.333A21.333 21.333 0 0 1 117.333 96h789.334zM864 160H160v704h704V160zM696.832 360.405l3.243 2.091 16.853 13.056a21.333 21.333 0 0 1 3.797 29.952L528.853 652.8a21.333 21.333 0 0 1-33.706 0L303.275 405.504a21.333 21.333 0 0 1 3.797-29.952l16.853-13.056a21.333 21.333 0 0 1 27.307.939l2.603 2.858L512 570.197l158.165-203.946a21.333 21.333 0 0 1 26.667-5.846z" />
        </svg>
    </IconWrapper>
);
