import { computed, ref } from 'vue';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { useNormalModel } from '../_util/use/useModel';
import type { InputFileEmit, InputFileProps } from './props';

//  <input type="file" /> 所需的数据
export const useInputFile = (props: InputFileProps, emit: InputFileEmit) => {
    const [currentFiles, updateCurrentFiles] = useNormalModel(props, emit);

    const inputRef = ref<HTMLInputElement | null>(null);

    // 表单组件的总体disabled状态
    const { isFormDisabled } = useFormAdaptor();
    const disabled = computed(() => props.disabled || isFormDisabled.value);

    const accept = computed(() => props.accept);

    const acceptStr = computed(() => accept.value.join(','));

    const multiple = computed(() => props.multiple);

    const openFileExplorer = () => {
        if (disabled.value) return;
        inputRef.value.click();
    };

    const handleInputFileChange = (e: Event): void => {
        const target = e.target as HTMLInputElement;

        const files = Array.from(target.files);
        if (!files) return;

        updateCurrentFiles(files);
        emit(CHANGE_EVENT, files);

        // 若不重置，重复选择相同文件，change 事件可能不触发
        target.value = null;
    };

    return {
        currentFiles,
        updateCurrentFiles,
        inputRef,
        disabled,
        multiple,
        accept,
        acceptStr,
        openFileExplorer,
        handleInputFileChange,
    };
};
