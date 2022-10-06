<script setup>
// Import Swiper Vue.js components
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted } from 'vue';
const props = defineProps(["data"])
// Import Swiper styles
let breakpoints = ref({})
breakpoints.value = {
    768: {
        slidesPerView: Number(props.data.num),
        slidesPerGroup: Number(props.data.num),
        spaceBetween: 16
    }
}
const modules = [Navigation, Pagination]
const onSwiper = (swiper) => {
    console.log(swiper);
};
const onSlideChange = () => {
    console.log('slide change');
};
</script>
<template>
    <div class="g-swiper">
        <swiper
                :modules="modules"
                :slides-per-view="1"
                :slidesPerGroup="1"
                :space-between="16"
                :breakpoints="breakpoints"
                :loop-fill-group-with-blank="true"
                :loop="true"
                navigation
                :pagination="{ clickable: true }"
                @swiper="onSwiper"
                @slideChange="onSlideChange">
            <swiper-slide v-for="slide in data.slides">
                <a class="g-swiper__a" :href="[slide.url?'':'javascript:;']" :target="[slide.open?'_target':'_self']">
                    <picture>
                        <source media="(max-width:768px)" :srcset="slide.mb" />
                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                    </picture>
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>
