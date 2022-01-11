const prefixCls = 'fes';

export default function getPrefixCls(suffixCls: string) {
    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
}
