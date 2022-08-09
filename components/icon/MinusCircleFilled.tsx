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
            <path d="M843.861 180.139c183.296 183.296 183.296 480.426 0 663.722s-480.426 183.296-663.722 0-183.296-480.426 0-663.722 480.426-183.296 663.722 0zM704 480H320a21.333 21.333 0 0 0-20.992 17.493l-.341 3.84v21.334a21.333 21.333 0 0 0 17.493 20.992L320 544h384a21.333 21.333 0 0 0 20.992-17.493l.341-3.84v-21.334a21.333 21.333 0 0 0-17.493-20.992L704 480z" />
        </svg>
    </IconWrapper>
);
