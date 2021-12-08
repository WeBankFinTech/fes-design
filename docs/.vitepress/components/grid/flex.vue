<template>
    <f-grid>
        <f-grid-item :flex="2">
            <div class="col-demo"> 2 / 5</div>
        </f-grid-item>
        <f-grid-item :flex="3">
            <div class="col-demo"> 3 / 5</div>
        </f-grid-item>
    </f-grid>
    <f-grid>
        <f-grid-item flex="100px">
            <div class="col-demo"> 100px </div>
        </f-grid-item>
        <f-grid-item flex="auto">
            <div class="col-demo"> auto </div>
        </f-grid-item>
    </f-grid>
    <f-grid>
        <f-grid-item flex="1 1 200px">
            <div class="col-demo"> 1 1 200px </div>
        </f-grid-item>
        <f-grid-item flex="0 1 300px">
            <div class="col-demo"> 0 1 300px </div>
        </f-grid-item>
    </f-grid>
</template>