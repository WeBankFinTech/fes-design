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
            <path d="M832.938667 102.058667a239.573333 239.573333 0 0 1 148.181333 211.2l0.213333 11.136a386.986667 386.986667 0 0 1-114.517333 274.773333l-339.797333 336.981333a21.333333 21.333333 0 0 1-30.037334 0l-339.797333-336.981333A386.986667 386.986667 0 0 1 42.666667 324.394667c0-94.122667 55.04-179.2 140.16-217.941334l10.24-4.394666a272.170667 272.170667 0 0 1 275.541333 42.24L512 180.053333l47.573333-38.314666a271.189333 271.189333 0 0 1 273.365334-39.68zM808.533333 161.28a207.189333 207.189333 0 0 0-200.704 24.021333l-8.106666 6.272-74.666667 60.16a21.333333 21.333333 0 0 1-26.965333-0.170666L427.904 193.706667a208.170667 208.170667 0 0 0-201.045333-35.968l-9.728 3.669333-0.981334 0.426667A175.530667 175.530667 0 0 0 106.666667 324.352a322.986667 322.986667 0 0 0 86.613333 220.074667l8.96 9.258666 309.76 307.2 309.76-307.2a322.986667 322.986667 0 0 0 95.317333-216.448l0.256-13.653333a175.573333 175.573333 0 0 0-100.693333-158.805333l-8.106667-3.541334z" />
        </svg>
    </IconWrapper>
);
