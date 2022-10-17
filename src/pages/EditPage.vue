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
const MODE = import.meta.env.MODE;

store.$subscribe((mutation, state) => {
    // console.log(mutation.events.target.content)
})

const cssVar = computed(() => {
    let bg = content.value.body.filter((c, i) => {
        return c.component == "GBg"
    })
    return {
        "--color": bg[0].content.color,
        "--pc": `url(${bg[0].content.pc})`,
        "--mb": `url(${bg[0].content.mb ? bg[0].content.mb : bg[0].content.pc})`,
        "--w": bg[0].content.w,
        "--h": bg[0].content.h,
        "--mw": bg[0].content.mw,
        "--mh": bg[0].content.mh,
    }
})

const menu = computed(() => {
    return Object.keys(components).map((m, i) => {
        return {
            title: m,
            label: components[m].label,
            limit: components[m].limit || 0,
            status: true
        }
    });
})


const onEvent = (type) => {
    switch (type) {
        case "home":
            store.$patch(state => {
                state.page = "Home"
            })
            break;
        case "submit":
            store.setSubmit("SAVE").then((res) => {
                console.log(res)
            })
            break;
        case "preview":
            store.$patch(state => {
                state.page = "Preview"
            })
            break;
        case "save":
            store.setSave(store.content).then((res) => {
                console.log(res)
            })
            break;
        case "eventList":
            store.$patch(state => {
                state.page = "EventList"
            })
            break;
    }
}

</script>
<template>
    <section class="wrap" :class="MODE" data-type="one" :style="cssVar">
        <template v-for="block in content.body">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <g-menu :menu="menu" />
    <div class="page-control__group">
        <a href="javascript:;" class="page-control__btn" @click="onEvent('save')">存檔</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('preview')">預覽</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('submit')">送審</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('eventList')">回列表</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('home')">回首頁</a>
    </div>
</template>