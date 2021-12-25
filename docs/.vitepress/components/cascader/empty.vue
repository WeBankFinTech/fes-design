<template>
    <div>
        <FCascader       
            v-model="empty.value"
            :options="empty.options">
        </FCascader>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs } from 'vue';
    
    const useEmpty = () => {
        const state = reactive({
            value: '',
        })

        return {
            ...toRefs(state),
            options: [],
        }
    }

    export default defineComponent({
        setup() {
            const empty = useEmpty()

            return {
                empty,
            }
        }
    })
</script>

<style scoped>
.fes-cascader {
    width: 200px;
}
</style>