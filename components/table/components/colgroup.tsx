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
                    // style 统一为单对象：语义直观，且避免数组形式在
                    // 不同渲染路径下的行为差异
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
