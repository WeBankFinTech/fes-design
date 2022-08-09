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
            <path d="M217.856 172.587 512 466.73l294.144-294.144a21.333 21.333 0 0 1 30.165 0l15.104 15.104a21.333 21.333 0 0 1 0 30.165L557.27 512l294.144 294.144a21.333 21.333 0 0 1 0 30.165l-15.104 15.104a21.333 21.333 0 0 1-30.165 0L512 557.27 217.856 851.413a21.333 21.333 0 0 1-30.165 0l-15.104-15.104a21.333 21.333 0 0 1 0-30.165L466.73 512 172.587 217.856a21.333 21.333 0 0 1 0-30.165l15.104-15.104a21.333 21.333 0 0 1 30.165 0z" />
        </svg>
    </IconWrapper>
);
