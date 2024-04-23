import { computed, defineComponent, provide, ref } from 'vue';
import {
    DESCRIPTIONS_PREFIX_CLASS,
    DESCRIPTIONS_PROVIDE_KEY,
} from './constants';
import { descriptionsProps } from './props';
import type { DescriptionsItemInst } from './interface';

const prefixCls = DESCRIPTIONS_PREFIX_CLASS;

const useItems = () => {
    const instances = ref<DescriptionsItemInst[]>([]);

    const add = (instance: DescriptionsItemInst) => {
        const nextInstances = [...instances.value];

        nextInstances.push(instance);
        nextInstances.sort(
            ({ index: indexA }, { index: indexB }) => indexA - indexB,
        );

        instances.value = nextInstances;
    };

    const remove = (id: DescriptionsItemInst['id']) => {
        const index = instances.value.findIndex((i) => i.id === id);
        if (index === -1) {
            return;
        }

        const nextInstances = [...instances.value];
        nextInstances.splice(index, 1);
        instances.value = nextInstances.map((instance, index) => ({
            ...instance,
            index,
        }));
    };

    return {
        items: instances,
        addItem: add,
        removeItem: remove,
    };
};

export default defineComponent({
    name: 'FDescriptions',
    props: descriptionsProps,
    setup(props, { slots }) {
        const style = computed(() => ({
            'grid-template-columns': `repeat(${props.column}, 1fr)`,
        }));

        const renderHeader = () => {
            if (slots.header) {
                return slots.header();
            }
            if (props.title) {
                return <div class={`${prefixCls}-header`}>{props.title}</div>;
            }
            return null;
        };

        const { items, addItem, removeItem } = useItems();

        provide(DESCRIPTIONS_PROVIDE_KEY, {
            parentProps: computed(() => {
                return {
                    column: props.column,
                    contentStyle: props.contentStyle,
                    labelAlign: props.labelAlign,
                    labelPlacement: props.labelPlacement,
                    labelStyle: props.labelStyle,
                    separator: props.separator,
                    bordered: props.bordered,
                };
            }),
            items,
            addItem,
            removeItem,
        });

        return () => {
            return (
                <div class={prefixCls}>
                    {renderHeader()}
                    <div
                        class={[
                            `${prefixCls}-body`,
                            props.bordered && 'is-bordered',
                        ]}
                        style={style.value}
                    >
                        {slots.default?.()}
                    </div>
                </div>
            );
        };
    },
});
