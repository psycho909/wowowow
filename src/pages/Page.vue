<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
// import components from "../Components1.js";
import components from "../Components.js";
import GLoading from "../components/GLoading.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, getBrowserLocales, getUrlSearchParams } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);
let lanBrowser = getBrowserLocales()[0];
let lanParams = getUrlSearchParams("lan");
const loading = ref(false);
const componentCount = ref(0);
const totalComponentCount = ref(0);
provide('$addComponent', () => {
    componentCount.value += 1;
});
provide('$componentCount', componentCount);

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
    loading.value = true;
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    footer.prod = store.config.gameName || 'bf!遊戲';
    footer.theme = store.config.footer == 1 ? 'light' : 'dark';
    totalComponentCount.value = content.value.length;

    if (footer.prod == "櫻桃小丸子") {
        if (lanParams) {
            if (lanParams == "zh") {
                footer.prod = "櫻桃小丸子";
            } else {
                footer.prod = "櫻桃小丸子EN";
            }
        } else {
            if (lanBrowser == "zh") {
                footer.prod = "櫻桃小丸子";
            } else {
                footer.prod = "櫻桃小丸子EN";
            }
        }
        // gameFooter(footer);
        // 偵測Footer的加入
        setTimeout(() => {
            gf_updateFooter(footer)
        }, 0);
    } else {
        // 偵測Footer的加入
        setTimeout(() => {
            gf_updateFooter(footer)
        }, 0);
    }
    watch(componentCount, (newVal) => {
        if (newVal === totalComponentCount.value) {
            loading.value = false;
        }
    });
})

</script>
<template>
    <GLoading :loading="loading"></GLoading>
    <section class="wrap" :data-type="store.config.pageTypeSeq" :style="cssVar">
        <template v-for="block in content">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
</template>