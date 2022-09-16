<script>
export default {
    name: "Slide"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { mainStore } from "../store/index";
import Control from "./Control.vue";
const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
const onSwiper = (swiper) => {
    console.log(swiper);
};
const onSlideChange = () => {
    console.log('slide change');
};
onMounted(() => {
    console.log("onMounted")
})
onUpdated(() => {
    console.log("onUpdated")
})
onUnmounted(() => {
    console.log("destroyed")
})
</script>
<template>
    <div class="box swiper-box" :data-uid="content.uid">
        <swiper
                :slides-per-view="1"
                :space-between="50"
                @swiper="onSwiper"
                @slideChange="onSlideChange">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
        </swiper>
        <Control :uid="content.uid" />
    </div>
</template>