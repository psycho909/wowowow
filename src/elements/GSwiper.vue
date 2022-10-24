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
    769: {
        slidesPerView: Number(props.data.num),
        slidesPerGroup: Number(props.data.num),
        spaceBetween: 16
    }
}
const modules = [Navigation, Pagination]
</script>
<template>
    <div class="g-swiper">
        <swiper
                :modules="modules"
                :slides-per-view="3"
                :slidesPerGroup="1"
                :space-between="0"
                :breakpoints="breakpoints"
                :loop-fill-group-with-blank="true"
                :centered-slides="true"
                :loop="true"
                navigation
                :pagination="{ clickable: true }">
            <swiper-slide v-for="slide in data.slides">
                <a class="g-swiper__a" :href="[slide.url?'':'javascript:;']"
                   :target="[slide.open && slide.url?'_target':'_self']">
                    <picture>
                        <source media="(max-width:768px)" :srcset="slide.mb || slide.pc" />
                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                    </picture>
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>
