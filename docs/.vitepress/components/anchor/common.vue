<template>
    <div>
        <FAnchor
            :links="[
                { title: 'Basic Usage', href: '#basic-usage' },
                { title: 'With Children', href: '#with-children', children: [
                    { title: 'Child Link', href: '#child-link' }
                ]},
                { title: 'API', href: '#api' }
            ]"
        />
        <div id="basic-usage" style="margin-top: 20px; padding: 20px; background: #f5f5f5;">
            <h3>Basic Usage Section</h3>
            <p>This is the basic usage section of the Anchor component demo.</p>
        </div>
        <div id="with-children" style="margin-top: 20px; padding: 20px; background: #f0f0f0;">
            <h3>With Children Section</h3>
            <p>This section has child links in the anchor.</p>
            <div id="child-link" style="margin-top: 20px; padding: 20px; background: #e5e5e5;">
                <h4>Child Link Section</h4>
                <p>This is a child link target.</p>
            </div>
        </div>
        <div id="api" style="margin-top: 20px; padding: 20px; background: #f5f5f5;">
            <h3>API Section</h3>
            <p>This section contains the API reference.</p>
        </div>
    </div>
</template>