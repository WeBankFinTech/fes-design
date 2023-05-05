import { Teleport, h, ref, watch, computed, defineComponent } from 'vue';
import { getSlot } from '../vnode';
export default defineComponent({
    name: 'LazyTeleport',
    props: {
        to: {
            type: [String, Object],
            default: undefined,
        },
        disabled: Boolean,
        show: {
            type: Boolean,
            required: true,
        },
    },
    setup(props) {
        const showTeleport = ref(props.show);
        watch(
            () => props.show,
            (val) => {
                if (val) {
                    showTeleport.value = true;
                }
            },
        );
        return {
            showTeleport: showTeleport,
            mergedTo: computed(() => props.to ?? 'body'),
        };
    },
    render() {
        return this.showTeleport
            ? this.disabled
                ? getSlot(this.$slots)
                : h(
                      Teleport,
                      {
                          disabled: this.disabled,
                          to: this.mergedTo,
                      },
                      getSlot(this.$slots),
                  )
            : null;
    },
});
