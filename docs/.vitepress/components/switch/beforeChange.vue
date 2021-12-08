<template>
    <FSwitch :beforeChange="beforeChange">
	</FSwitch>
</template>
<script>
export default {
    setup(){
        const beforeChange = ()=> {
			return window.confirm("真的真的真的切换吗?")
        }
        return {
            beforeChange
        }
    }
}
</script>