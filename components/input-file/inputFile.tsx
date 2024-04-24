import { type StyleValue, type VNodeChild, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import Button from '../button';
import { UploadOutlined } from '../icon';
import { COMPONENT_NAME } from './const';
import { type InputFileSlots, inputFileProps } from './props';
import { useInputFile } from './useInputFile';

const prefixCls = getPrefixCls('input-file');
const cls = (appendClass: string): string => `${prefixCls}-${appendClass}`;

const InputFile = defineComponent({
    name: COMPONENT_NAME,
    props: inputFileProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    slots: Object as InputFileSlots,
    setup: (props, { emit, slots, attrs }) => {
        useTheme();

        const {
            currentFiles,
            inputRef,
            disabled,
            multiple,
            acceptStr,
            openFileExplorer,
            handleInputFileChange,
        } = useInputFile(props, emit);

        const renderTrigger = (): VNodeChild => {
            if (slots.default) {
                return slots.default({});
            }
            return (
                <Button
                    class={cls('trigger-button')}
                    disabled={disabled.value}
                    v-slots={{ icon: () => <UploadOutlined /> }}
                >
                    选择文件
                </Button>
            );
        };

        const renderFileList = (files: File[]): VNodeChild => {
            if (files.length === 0) {
                return null;
            }

            if (slots.fileList) {
                return slots.fileList({ files });
            }

            return files.length > 1 ? `${files.length} 个文件` : files[0].name;
        };

        return () => (
            <div class={prefixCls}>
                <div
                    class={cls('visible-content')}
                    style={attrs.style as StyleValue}
                >
                    <div class={cls('trigger')} onClick={openFileExplorer}>
                        {renderTrigger()}
                    </div>
                    <div class={cls('file-list')}>
                        {renderFileList(currentFiles.value)}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    class={cls('input')}
                    type={'file'}
                    accept={acceptStr.value}
                    multiple={multiple.value}
                    onChange={handleInputFileChange}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    },
});

export default InputFile;
