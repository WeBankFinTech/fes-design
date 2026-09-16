<template>
    <div :class="`${prefixCls}-addon`">
        <slot name="addon" :activeTime="activeTime">
            <div :class="`${prefixCls}-addon-inner`">
                <FButton
                    v-if="showNowShortcut"
                    type="link"
                    size="small"
                    @mousedown.prevent
                    @click="$emit('now')"
                >
                    {{ t('timePicker.now') }}
                </FButton>
                <FButton
                    type="primary"
                    size="small"
                    @mousedown.prevent
                    @click="$emit('confirm')"
                >
                    {{ t('timePicker.confirm') }}
                </FButton>
            </div>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLocale } from '../config-provider/useLocale';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('time-picker');

export default defineComponent({
    name: 'FTimePickerAddon',
    props: {
        activeTime: {
            type: String,
            default: '',
        },
        showNowShortcut: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['now', 'confirm'],
    setup() {
        useTheme();
        const { t } = useLocale();
        return {
            prefixCls,
            t,
        };
    },
});
</script>
