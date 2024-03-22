import { type Ref, ref } from 'vue';
import { matchType } from '../upload/utils';

export const useFileDrop = ({
    accept,
    multiple,
    disabled,
    afterDrop,
    onFileTypeInvalid,
}: {
    accept: Ref<string[]>;
    multiple: Ref<boolean>;
    disabled: Ref<boolean>;
    afterDrop: (files: File[]) => void;
    onFileTypeInvalid?: (files: File[]) => void;
}) => {
    const isHovering = ref(false);

    const handleEnter = (event: DragEvent): void => {
        if (disabled.value) return;
        event.preventDefault();

        isHovering.value = true;
    };

    const handleLeave = (event: DragEvent): void => {
        if (disabled.value) return;
        event.preventDefault();

        isHovering.value = false;
    };

    const handleOver = (event: DragEvent): void => {
        if (disabled.value) return;
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent): void => {
        if (disabled.value) return;
        event.preventDefault();

        isHovering.value = false;
        let files = Array.from(event.dataTransfer.files);
        if (!files.length) return;
        if (!multiple.value) {
            files = files.slice(0, 1);
        }

        const filterFiles = accept.value.length
            ? files.filter((file) => {
                  return matchType(file.name, file.type, accept.value);
              })
            : files;
        if (filterFiles.length !== files.length) {
            onFileTypeInvalid?.(
                files.filter((file) => {
                    return !matchType(file.name, file.type, accept.value);
                }),
            );
        }

        afterDrop(files);
    };

    return {
        isHovering,
        handleEnter,
        handleLeave,
        handleOver,
        handleDrop,
    };
};
