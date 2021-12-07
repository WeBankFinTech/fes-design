const nodeList = new Map();

let startClick;

document.addEventListener('mousedown', (e) => {
    startClick = e;
});

document.addEventListener('mouseup', (e) => {
    const values = nodeList.values();
    // eslint-disable-next-line no-restricted-syntax
    for (const documentHandler of values) {
        documentHandler(e, startClick);
    }
});

function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
        excludes = binding.arg;
    } else {
        // due to current implementation on binding type is wrong the type casting is necessary here
        excludes.push(binding.arg);
    }
    return (mouseup, mousedown) => {
        const mouseUpTarget = mouseup.target;
        const mouseDownTarget = mousedown?.target;
        const isTargetExists = !mouseUpTarget || !mouseDownTarget;
        const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
        const isSelf = el === mouseUpTarget;
        const isTargetExcluded = (excludes.length
        && excludes.some(item => item?.contains(mouseUpTarget))
        ) || (
            excludes.length && excludes.includes(mouseDownTarget)
        );
        if (
            isTargetExists
            || isContainedByEl
            || isSelf
            || isTargetExcluded
        ) {
            return;
        }
        binding.value();
    };
}

export default {
    beforeMount(el, binding) {
        nodeList.set(el, createDocumentHandler(el, binding));
    },
    updated(el, binding) {
        nodeList.set(el, createDocumentHandler(el, binding));
    },
    unmounted(el) {
        nodeList.delete(el);
    },
};
