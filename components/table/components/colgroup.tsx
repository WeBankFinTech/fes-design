import {
    type ComponentObjectPropsOptions,
    type PropType,
    defineComponent,
    inject,
} from 'vue';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const { layout } = inject(provideKey);
        const renderColgroup = (columns: ColumnInst[]) => (
            <colgroup>
                {columns.map((column) => {
                    // SSR 首帧：computeX() 尚无 DOM 测量结果，读静态兜底表
                    // （列声明的 width/minWidth），保证表格不塌成 0 宽
                    const source = layout.ssrWidthMap?.value?.[column.id]
                        ? layout.ssrWidthMap
                        : layout.widthMap;
                    const width = source.value[column.id]?.width;
                    const minWidth = source.value[column.id]?.minWidth;
                    // 注意：style 必须是单个对象（不能是数组）——SSR 下数组
                    // 形式的 style 不会被序列化进 HTML，导致列宽丢失
                    const style: Record<string, string> = {};
                    if (width) {
                        style.width = `${width}px`;
                    }
                    if (minWidth) {
                        style.minWidth = `${minWidth}px`;
                    }
                    return <col key={column.id} style={style} />;
                })}
            </colgroup>
        );
        return () => renderColgroup(props.columns);
    },
});
