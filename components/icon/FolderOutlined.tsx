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
            <path d="M452.523 158.635 551.68 302.08h354.816a21.333 21.333 0 0 1 21.333 21.333v529.835a21.333 21.333 0 0 1-21.333 21.333H117.419a21.333 21.333 0 0 1-21.334-21.333V170.752a21.333 21.333 0 0 1 21.334-21.333h317.568a21.333 21.333 0 0 1 17.536 9.216zm-39.936 54.784H160v597.12h703.744V366.08H518.101L412.587 213.419z" />
        </svg>
    </IconWrapper>
);
