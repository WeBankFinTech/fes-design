// index.ts
export const INDEX_TPL = `
    import { withInstall } from '../_util/withInstall';
import COMPONENT_CAMEL_NAME from './COMPONENT_NAME';
import type { SFCWithInstall } from '../_util/interface';

type COMPONENT_CAMEL_NAMEType = SFCWithInstall<typeof COMPONENT_CAMEL_NAME>;

export const FCOMPONENT_CAMEL_NAME = withInstall<COMPONENT_CAMEL_NAMEType>(
    COMPONENT_CAMEL_NAME as COMPONENT_CAMEL_NAMEType,
);

export default FCOMPONENT_CAMEL_NAME;
`;

export const SVG_COMPONENT_TMPLATE = `
import IconWrapper from './IconWrapper';
import type { IconProps } from './IconWrapper';
import './style';

export default (props?: IconProps) => (
    <IconWrapper {...props} ATTRS>
        SVG
    </IconWrapper>
);
`;
