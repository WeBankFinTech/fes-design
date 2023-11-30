import { reactive, computed } from 'vue';
import { isArray } from 'lodash-es';
import type { SelectProps } from './props';
import type { SelectOption, OptionChildren } from './interface';

function useGenUid() {
    let seed = 0;
    const now = Date.now();
    function genUid() {
        return `select_group_${now}_${seed++}`;
    }

    return {
        genUid,
    };
}

export default ({ props }: { props: SelectProps }) => {
    const childOptions = reactive([]);

    const { genUid } = useGenUid();

    const addOption = (
        option: OptionChildren,
        groupOption?: OptionChildren,
    ) => {
        if (groupOption) {
            if (!groupOption.children.includes(option)) {
                groupOption.children.push(option);
            }
        } else {
            if (!childOptions.includes(option)) {
                childOptions.push(option);
            }
        }
    };

    const removeOption = (id: number | string, groupOption: OptionChildren) => {
        if (groupOption) {
            const colIndex = groupOption.children.findIndex(
                (item) => item.id === id,
            );
            if (colIndex !== -1) {
                groupOption.children.splice(colIndex, 1);
            }
        } else {
            const colIndex = childOptions.findIndex((item) => item.id === id);
            if (colIndex !== -1) {
                childOptions.splice(colIndex, 1);
            }
        }
    };

    const baseOptions = computed(() => {
        const allOptions = [...childOptions, ...(props.options || [])];

        const getOption = (
            option: SelectOption,
            groupOption?: SelectOption,
        ) => {
            const currentOption = {
                ...option,
                value: option[props.valueField],
                label: option[props.labelField],
                // 当分组禁用时，子选项都禁用
                disabled: groupOption?.disabled || option.disabled,
                __level: (groupOption?.__level || 0) + 1,
            };
            if (isArray(currentOption.children)) {
                currentOption.__isGroup = true;
                // 虚拟滚动，需要指定 value
                currentOption.value = currentOption.value || genUid();

                const children = currentOption.children.map((subOption) => {
                    return getOption(subOption, currentOption);
                });

                currentOption.children = children;
            } else {
                currentOption.__isGroup = false;
            }
            return currentOption;
        };

        return allOptions.reduce((acc: SelectOption[], option) => {
            return acc.concat(getOption(option));
        }, []);
    });

    const flatBaseOptions = computed(() => {
        const getFlatOptions = (options: SelectOption[]) => {
            let flatOptions: SelectOption[] = [];

            options.forEach((option) => {
                if (option.__isGroup) {
                    flatOptions = flatOptions.concat(
                        [option].concat(getFlatOptions(option.children)),
                    );
                } else {
                    flatOptions.push(option);
                }
            });

            return flatOptions;
        };

        return baseOptions.value.reduce((acc: SelectOption[], option) => {
            return acc.concat(getFlatOptions([option]));
        }, []);
    });

    return {
        addOption,
        removeOption,
        flatBaseOptions,
    };
};
