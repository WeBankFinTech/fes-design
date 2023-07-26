import { createVNode, render } from 'vue';

let vm;
export default async function playground(codeName) {
    if (vm) {
        vm.component.exposed.handleShow(true);
        vm.component.props.codeName = codeName;
        return vm;
    }
    const component = (await import('./exampleRepl.vue')).default;
    const container = document.createElement('div');
    vm = createVNode(component, {
        codeName,
    });
    render(vm, container);

    document.body.appendChild(container);
    return vm;
}
