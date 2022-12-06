<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, gameNameFilter } from "../Tool";
import gameFooter from "../gameFooter";
const store = mainStore()
const { content } = storeToRefs(store);

const cssVar = computed(() => {
    if (content.value.length > 0) {
        let bg = content.value.filter((c, i) => {
            return c.component == "GBg"
        })
        return {
            "--color": bg[0].content.color,
            "--pc": `url(${bg[0].content.pc})`,
            "--mobile": `url(${bg[0].content.mobile ? bg[0].content.mobile : bg[0].content.pc})`,
            "--w": bg[0].content.w,
            "--h": bg[0].content.h,
            "--mw": bg[0].content.mw,
            "--mh": bg[0].content.mh,
        }
    }
})
let footer = {}
onMounted(() => {
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    footer.prod = gameNameFilter(store.config.gameseq)[0].gameName || '天堂M';
    footer.theme = store.config.footer == 1 ? 'light' : 'dark';
    gameFooter(footer);
})

</script>
<template>
    <section class="wrap" :data-type="store.config.pageTypeSeq" :style="cssVar">
        <template v-for="block in content">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
</template>