// import { createApp } from 'vue';
// import ExampleRepl from './exampleRepl.vue';

// let app;
// export default function playground(codeName) {
//     if (app) {
//         console.log(app);
//         app.component.setupState.isShow = true;
//         app.component.props.codeName = codeName;
//         return app;
//     }
//     const container = document.createElement('div');
//     document.body.appendChild(container);
//     app = createApp(ExampleRepl, {
//         codeName
//     });
//     app.mount(container);

//     return app;
// }

import { createVNode, render } from 'vue';
import ExampleRepl from './exampleRepl.vue';

let vm;
export default function playground(codeName) {
    if (vm) {
        vm.component.exposed.handleShow(true);
        vm.component.props.codeName = codeName;
        return vm;
    }
    const container = document.createElement('div');
    vm = createVNode(ExampleRepl, {
        codeName,
    });
    render(vm, container);

    document.body.appendChild(container);
    return vm;
}
