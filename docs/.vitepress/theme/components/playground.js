import { createVNode, defineAsyncComponent, render } from 'vue';

const AsyncExampleRepl = defineAsyncComponent({
    loader: () => import('./exampleRepl.vue'),
});

let vm;
export default function playground({ codeName, codeSrc }) {
    if (vm) {
        const exampleReplComponent = vm.component.subTree.component;
        exampleReplComponent.props.codeName = codeName;
        exampleReplComponent.props.codeSrc = codeSrc;
        exampleReplComponent.exposed.handleShow(true);
        return vm;
    }
    const container = document.createElement('div');
    vm = createVNode(AsyncExampleRepl, {
        codeName,
        codeSrc,
    });

    render(vm, container);

    document.body.appendChild(container);
    return vm;
}
