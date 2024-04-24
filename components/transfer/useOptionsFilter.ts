import { type Ref, computed, ref } from 'vue';
import type {
    TransferFilter,
    TransferInjection,
    TransferOption,
} from './interface';

export const useOptionsFilter = ({
    options,
    filter,
    rootProps,
}: Pick<TransferInjection, 'rootProps'> & {
    options: Ref<TransferOption[]>;
    filter: TransferFilter;
}) => {
    const filterText = ref<string>('');

    const displayOptions = computed<TransferOption[]>(() => {
        if (!rootProps.filterable) {
            return options.value;
        }
        return options.value.filter((option) =>
            filter(filterText.value, option),
        );
    });

    return { filterText, displayOptions };
};
