<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { watchEffect } from 'vue';
import components from "../Components.js";
import GMenu from "../components/GMenu.vue";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);
const MODE = import.meta.env.MODE;

let bgSetting = ref({ "--pc": "", "--mb": "", "--color": "" })
let bg = computed(() => {
    return content.value.body.filter((c, i) => {
        return c.component == "GBg"
    })
})

watchEffect(() => {
    if (bg.value[0]) {
        if (bg.value[0].content) {
            bgSetting.value["--color"] = bg.value[0].content.color
            bgSetting.value["--pc"] = `url(${bg.value[0].content.pc})`
            bgSetting.value["--mb"] = `url(${bg.value[0].content.mb})`
            bgSetting.value["--w"] = bg.value[0].content.w
            bgSetting.value["--h"] = bg.value[0].content.h
            bgSetting.value["--mw"] = bg.value[0].content.mw
            bgSetting.value["--mh"] = bg.value[0].content.mh
        }
    }
})

onMounted(() => {
    if (Object.keys(bg.value[0])) {
        if (Object.keys(bg.value[0].content).length > 0) {
            bgSetting.value["--color"] = bg.value[0].content.color
            bgSetting.value["--pc"] = `url(${bg.value[0].content.pc})`
            bgSetting.value["--mb"] = `url(${bg.value[0].content.mb})`
            bgSetting.value["--w"] = bg.value[0].content.w
            bgSetting.value["--h"] = bg.value[0].content.h
            bgSetting.value["--mw"] = bg.value[0].content.mw
            bgSetting.value["--mh"] = bg.value[0].content.mh
        }
    }

})
const menu = computed(() => {
    return Object.keys(components).map((m, i) => {
        return {
            title: m,
            label: components[m].label,
            status: true
        }
    });
})
</script>
<template>
    <section class="wrap" :class="MODE" data-type="one" :style="bgSetting">
        <template v-for="block in content.body">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <g-menu :menu="menu" />

</template>