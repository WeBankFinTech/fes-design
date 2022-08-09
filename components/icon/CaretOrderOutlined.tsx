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
            <path d="M682.624 554.667a17.067 17.067 0 0 1 14.976 25.258l-1.963 2.859-170.624 201.173-1.962 2.006a17.067 17.067 0 0 1-21.59.426l-2.474-2.432-170.624-201.173a17.067 17.067 0 0 1 9.557-27.733l3.456-.384h341.29zM523.051 238.08l1.962 1.963 170.624 201.173a17.067 17.067 0 0 1-13.013 28.117h-341.29a17.067 17.067 0 0 1-13.014-28.117l170.624-201.173a17.067 17.067 0 0 1 24.064-2.006z" />
        </svg>
    </IconWrapper>
);
