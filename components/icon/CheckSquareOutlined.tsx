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
            <path d="M906.667 96A21.333 21.333 0 0 1 928 117.333v789.334A21.333 21.333 0 0 1 906.667 928H117.333A21.333 21.333 0 0 1 96 906.667V117.333A21.333 21.333 0 0 1 117.333 96h789.334zM864 160H160v704h704V160zM692.821 308.139l3.243 2.09 16.853 13.056a21.333 21.333 0 0 1 3.755 29.952l-253.91 327.168a21.333 21.333 0 0 1-33.706 0L307.328 523.477a21.333 21.333 0 0 1 3.797-29.952l16.854-13.056a21.333 21.333 0 0 1 29.909 3.798l88.064 113.45 220.16-283.733a21.333 21.333 0 0 1 26.71-5.845z" />
        </svg>
    </IconWrapper>
);
