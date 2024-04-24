import { ref, watch } from 'vue';
import type { TreeProps } from '../tree';
import type useFilter from '../tree/useFilter';
import type { TransferInjection } from './interface';

// TODO: InstanceType<typeof Tree> 无法拿到 expose 的类型，这里暂时使用手动的写法
interface TreeInstance {
    filter: NonNullable<ReturnType<typeof useFilter>['filter']>;
}

export const useTreeFilter = ({
    rootProps,
}: Pick<TransferInjection, 'rootProps'>) => {
    const treeRef = ref<TreeInstance | null>(null);
    const filterText = ref<string>('');

    watch(filterText, (text) => {
        if (!treeRef.value) {
            return;
        }
        treeRef.value.filter(text);
    });

    const defaultFilterForTree
        = (): TreeProps['filterMethod'] => (filterText, treeNode) => {
            const transferOption = rootProps.options.find(
                ({ value }) => value === treeNode.value,
            );
            if (!transferOption) {
                return false;
            }
            return transferOption.label.includes(filterText);
        };

    return {
        treeRef,
        filterText,
        defaultFilterForTree,
    };
};
