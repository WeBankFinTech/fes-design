import { onMounted } from 'vue';

export function hideLayout() {
    onMounted(() => {
        const inIframeVPApp = document.body.querySelector('.VPApp');
        inIframeVPApp.querySelector('.VPNav').style.display = 'none';
        inIframeVPApp.querySelector('.VPContent').style =
            'padding: 0 !important';
        inIframeVPApp.querySelector('.VPContentDoc').style =
            'width: 100%; padding: 0 !important;';
        inIframeVPApp.querySelector('.VPContentDoc .content').style =
            'max-width: 100%;';
        inIframeVPApp.querySelector('.VPContentDoc .content .vp-doc').style =
            'margin: 0; padding: 0;';
    });
}
