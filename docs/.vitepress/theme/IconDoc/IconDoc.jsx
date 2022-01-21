import * as Icons from './icons';
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';

const copyToClipboard = (content) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', content);
    input.select();
    if (document.execCommand('copy')) {
        return true;
    }
    document.body.removeChild(input);
    return false;
};

const IconItem = (props, { slots }) => {
    const copyIconCode = () => {
        FMessage.success(`复制成功 <${props.name} />`);
        copyToClipboard(`<${props.name} />`);
    };
    return (
        <div onClick={copyIconCode} class="icon-item">
            {slots.default && slots.default()}
            <span class="icon-name">{props.name}</span>
        </div>
    );
};

export default () => (
    <div class="icon-doc">
        {Object.keys(Icons).map((key) => (
            <IconItem name={key}>{Icons[key]()}</IconItem>
        ))}
    </div>
);
