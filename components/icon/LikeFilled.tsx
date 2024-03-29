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
            <path d="M192.085333 118.442667l0.938667-0.426667a272.170667 272.170667 0 0 1 275.626667 42.24L512 196.053333l47.573333-38.357333a271.189333 271.189333 0 0 1 273.365334-39.68 239.573333 239.573333 0 0 1 148.181333 211.2l0.213333 11.136a386.986667 386.986667 0 0 1-114.517333 274.773333l-339.797333 336.981334a21.333333 21.333333 0 0 1-30.037334 0l-339.797333-336.938667A386.986667 386.986667 0 0 1 42.666667 340.394667a239.530667 239.530667 0 0 1 149.418666-221.952z" />
        </svg>
    </IconWrapper>
);
