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
            <path d="M117.333 944.981A21.333 21.333 0 0 1 96 923.648V405.333a21.333 21.333 0 0 1 8.277-16.896L498.944 83.456a21.333 21.333 0 0 1 26.112 0l394.667 304.981A21.333 21.333 0 0 1 928 405.333v518.272a21.333 21.333 0 0 1-21.333 21.334H117.333zM512 157.952 160 424.107v456.832h209.195V582.272a21.333 21.333 0 0 1 21.333-21.333h242.901a21.333 21.333 0 0 1 21.334 21.333v298.667H864V424.107l-352-266.24zm78.763 467.03H433.195v256h157.568v-256z" />
        </svg>
    </IconWrapper>
);
