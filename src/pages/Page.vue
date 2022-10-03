<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GMenu from "../components/GMenu.vue";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);

let bgSetting = reactive({ "--pc": "", "--mb": "", "--color": "" })
let bg = computed(() => {
    return content.value.body.filter((c, i) => {
        return c.component == "GBg"
    })
})
if (bg.value.length > 0) {
    bgSetting = {
        "--pc": bg.value[0].content[0].pc,
        "--mb": bg.value[0].content[0].mb,
        "--color": bg.value[0].content[0].color,
    }
}

const menu = computed(() => {
    return Object.keys(components).map((m, i) => {
        return {
            title: m,
            label: components[m].label
        }
    });
})
</script>
<template>
    <div class="wrap" data-type="one" :style="bgSetting">
        <template v-for="block in content.body">
            <component :is="block.component" :content="block"></component>
        </template>
    </div>
    <g-menu :menu="menu" />

</template>