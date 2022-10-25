<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);


const cssVar = computed(() => {
    if (content.value.body) {
        let bg = content.value.body.filter((c, i) => {
            return c.component == "GBg"
        })
        return {
            "--color": bg[0].content.color,
            "--pc": `url(${bg[0].content.pc})`,
            "--mb": `url(${bg[0].content.mobile ? bg[0].content.mobile : bg[0].content.pc})`,
            "--w": bg[0].content.w,
            "--h": bg[0].content.h,
            "--mw": bg[0].content.mw,
            "--mh": bg[0].content.mh,
        }
    }
})

</script>
<template>
    <section class="wrap" data-type="one" :style="cssVar">
        <template v-for="block in content.body">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
</template>