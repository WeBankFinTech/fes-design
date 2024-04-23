import { type StyleValue, type VNodeChild, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import Message from '../message';
import { useLocale } from '../config-provider/useLocale';
import { COMPONENT_NAME_DRAGGER } from './const';
import { type InputFileSlots, inputFileDraggerProps } from './props';
import { useInputFile } from './useInputFile';
import { useFileDrop } from './useFileDrop';

const prefixCls = getPrefixCls('input-file-dragger');
const cls = (appendClass: string): string => `${prefixCls}-${appendClass}`;

const InputFileDragger = defineComponent({
    name: COMPONENT_NAME_DRAGGER,
    props: inputFileDraggerProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    slots: Object as InputFileSlots,
    setup: (props, { emit, slots, attrs }) => {
        useTheme();

        const { t } = useLocale();

        const {
            currentFiles,
            updateCurrentFiles,
            inputRef,
            disabled,
            multiple,
            accept,
            acceptStr,
            openFileExplorer,
            handleInputFileChange,
        } = useInputFile(props, emit);

        const handleFileTypeInvalid = (files: File[]): void => {
            if (!props.onFileTypeInvalid) {
                Message.error(t('upload.fileTypeInvalidTip'));
            }
            props.onFileTypeInvalid(files);
        };

        const { isHovering, handleEnter, handleLeave, handleOver, handleDrop } =
            useFileDrop({
                disabled,
                multiple,
                accept,
                afterDrop: (files) => {
                    updateCurrentFiles(files);
                    emit(CHANGE_EVENT, files);
                },
                onFileTypeInvalid: handleFileTypeInvalid,
            });

        const renderFileList = (files: File[]): VNodeChild => {
            if (files.length === 0) return null;

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
                    <div
                        class={[
                            cls('droppable'),
                            isHovering.value && 'is-hovering',
                            disabled.value && 'is-disabled',
                        ]}
                        onDragenter={handleEnter}
                        onDragleave={handleLeave}
                        onDrop={handleDrop}
                        onDragover={handleOver}
                        onClick={openFileExplorer}
                    >
                        {slots.default?.({})}
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

export default InputFileDragger;
