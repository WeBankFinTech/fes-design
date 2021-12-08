
const prefixCls = 'fes';

export default function getPrefixCls(suffixCls) {
    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
}
