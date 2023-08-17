<template>
    <div class="demo-collapse">
        <FCollapse v-model="activeNames" @change="handleChange">
            <FCollapseItem title="Consistency" name="1">
                <div>
                    岁月静好，浅笑安然。打开记忆的闸门，仿佛又回到了那年那月那时光，仿佛又见到你送给我的那盆清香茉莉，在细雨潇潇的夜晚，所呈现出来的洁净和楚楚动人。以前的过往总是在记忆深处，以固有的姿态，以从未稍离的执着提醒我，生命中有一种存在，叫以前。
                </div>
            </FCollapseItem>
            <FCollapseItem title="Feedback" name="2">
                <div>
                    生活是蜿蜒在山中的小径，坎坷不平，沟崖在侧。摔倒了，要哭就哭吧，怕什么，不心装模作样！这是直率，不是软弱，因为哭一场并不影响赶路，反而能增添一份留意。山花烂漫，景色宜人，如果陶醉了，想笑就笑吧，不心故作矜持！这是直率，不是骄傲，因为笑一次并不影响赶路，反而能增添一份信心。
                </div>
            </FCollapseItem>
            <FCollapseItem title="Efficiency" name="3">
                <div>
                    喜欢一种情意，浅浅淡淡，不远不近。念起便有一种沁心的暖，知心的柔。岁月轮转，韶华渐老，惟愿人依旧安静，温雅。世事经年，惟愿情怀依旧宁静如初。静默时光的彼岸，就让我宁心等待一场必然来临的春暖花开。即使偶尔会有心潮澎湃，亦是沉寂中的安恬与端庄。
                </div>
            </FCollapseItem>
            <FCollapseItem title="Controllability" name="4">
                <div>
                    一弯月光，风飘云漫，多少个明月夜，寂寞走不出思念的射线，静静的听你梦中的心跳，轻嗅你唇边的香息，柔醉你缱绻的缠绵。衣袂飘飘，心香瓣瓣，在飘渺的细雨中，衍生了无尽的眷恋。用一生的深情与你凝眸相拥，朝夕相伴。幽篁深处，落叶与娇花相随，你我的沉醉，静默了一池山水。
                </div>
            </FCollapseItem>
        </FCollapse>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const activeNames = ref(['1']);
        const handleChange = (value) => {
            console.log('[collapse.basic] [handleChange] value:', value);
        };
        return {
            activeNames,
            handleChange,
        };
    },
};
</script>
