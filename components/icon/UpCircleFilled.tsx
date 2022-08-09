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
            <path d="M512 981.333c259.2 0 469.333-210.133 469.333-469.333S771.2 42.667 512 42.667 42.667 252.8 42.667 512 252.8 981.333 512 981.333zm184.832-317.738a21.333 21.333 0 0 1-26.667-5.888L512 453.803 353.835 657.749l-2.603 2.816a21.333 21.333 0 0 1-27.307.939l-16.853-13.056a21.333 21.333 0 0 1-3.797-29.952L495.147 371.2a21.333 21.333 0 0 1 33.706 0l191.872 247.339a21.333 21.333 0 0 1-3.797 29.952l-16.853 13.056z" />
        </svg>
    </IconWrapper>
);
