<template>
    <div class="text-tips">不折叠选中项（默认）：</div>
    <FSelectTree :data="data" multiple clearable>
    </FSelectTree>
    <div class="text-tips">折叠选中项（默认1项起）：</div>
    <FSelectTree :data="data" multiple clearable collapseTags>
    </FSelectTree>
    <div class="text-tips">折叠选中项（2项起）：</div>
    <FSelectTree :data="data" multiple clearable collapseTags :collapseTagsLimit="2">
    </FSelectTree>
</template>
<script>
import { reactive } from 'vue';

function createData (level = 1, baseKey = '', prefix = null, suffix = null) {
  if (!level) return undefined
  return Array.apply(null, { length: 2 }).map((_, index) => {
    const key = '' + baseKey + level + index
    return {
      label: createLabel(level),
      value: key,
      children: createData(level - 1, key, prefix, suffix),
      prefix: prefix? () =>
        h(PictureOutlined) : null,
      suffix:suffix ? () =>
        h(PlusCircleOutlined): null
    }
  })
}

function createLabel (level) {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
}

export default {
    setup(){
        const data = reactive(createData(4));
        return {
            data
        }
    }
}
</script>
<style lang="less" scoped>
.fes-select-tree {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
