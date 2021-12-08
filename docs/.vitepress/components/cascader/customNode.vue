<template>
    <FCascader       
        :options="customNode.options">
        <template #default="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
    </FCascader>
</template>

<script>
    import { defineComponent, } from 'vue';

    const options = [
        {
            "value": "110000",
            "label": "北京市",
            "children": [
                {
                    "value": "110100",
                    "label": "市辖区",
                    "children": [
                        {
                            "value": "110101",
                            "label": "东城区东城区东城区东城区东城区东城区",
                        },
                        {
                            "value": "110102",
                            "label": "西城区",
                        },
                        {
                            "value": "110103",
                            "label": "崇文区",
                        },
                        {
                            "value": "110104",
                            "label": "宣武区",
                        },
                        {
                            "value": "110105",
                            "label": "朝阳区",
                        },
                        {
                            "value": "110106",
                            "label": "丰台区",
                        },
                        {
                            "value": "110107",
                            "label": "石景山区",
                        },
                        {
                            "value": "110108",
                            "label": "海淀区",
                        },
                        {
                            "value": "110109",
                            "label": "门头沟区",
                        },
                        {
                            "value": "110111",
                            "label": "房山区",
                        },
                        {
                            "value": "110112",
                            "label": "通州区",
                        },
                        {
                            "value": "110113",
                            "label": "顺义区",
                        },
                        {
                            "value": "110114",
                            "label": "昌平区",
                        },
                        {
                            "value": "110115",
                            "label": "大兴区",
                        },
                        {
                            "value": "110116",
                            "label": "平谷区",
                        },
                        {
                            "value": "110117",
                            "label": "怀柔区",
                        }
                    ]
                },
                {
                    "value": "110200",
                    "label": "市辖县",
                    "children": [
                        {
                            "value": "110228",
                            "label": "密云县",
                        },
                        {
                            "value": "110229",
                            "label": "延庆县",
                        }
                    ]
                }
            ]
        },
        {
            "value": "130000",
            "label": "河北省",
            "children": [
                {
                    "value": "130100",
                    "label": "石家庄市",
                },
                {
                    "value": "130200",
                    "label": "唐山市",
                },
                {
                    "value": "130300",
                    "label": "秦皇岛市",
                },
                {
                    "value": "130400",
                    "label": "邯郸市",
                },
                {
                    "value": "130500",
                    "label": "邢台市",
                },
                {
                    "value": "130600",
                    "label": "保定市",
                },
                {
                    "value": "130700",
                    "label": "张家口市",
                },
                {
                    "value": "130800",
                    "label": "承德市",
                },
                {
                    "value": "130900",
                    "label": "沧州市",
                },
                {
                    "value": "131000",
                    "label": "廊坊市",
                },
                {
                    "value": "131100",
                    "label": "衡水市",
                }
            ]
        },
    ]
    
    const useCustomNode = () => {
        return {
            options,
        }
    }

    export default defineComponent({
        setup() {
            // 自定义节点内容
            const customNode = useCustomNode()

            return {
                customNode,
            }
        }
    })
</script>

<style lang="less" scoped>
.fes-cascader {
    width: 200px;
}
</style>
<style lang="less" scoped>
.text-tips {
    margin-top: 10px;
}
</style>