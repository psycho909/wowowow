<script setup>
// Import Swiper Vue.js components
import { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { mainStore } from "../store/index";
const props = defineProps(["data", "status"]);
const store = mainStore()
let breakpoints = ref({})
let autoplay = ref({});
breakpoints.value = {
    769: {
        slidesPerView: Number(props.data.num),
        slidesPerGroup: Number(props.data.num),
        spaceBetween: 16,
        centeredSlides: false
    }
}

if (props.data?.autoplay?.open) {
    autoplay.value = {
        delay: Number(props.data.autoplay.delay) * 1000
    }
} else {
    autoplay.value = false;
}
const modules = [Navigation, Pagination, Autoplay];
const onSwiper = (swiper) => {
    if (!props.status) {
        swiper.disable()
    }
};
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
                :pagination="{ clickable: true }"
                :autoplay="autoplay"
                :set-wrapper-size="true"
                @swiper="onSwiper">
            <swiper-slide v-for="slide in data.slides">
                <template v-if="store.status == 'edit'">
                    <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                       :target="[slide.url ? '_blank' : '']">
                        <picture>
                            <source media="(max-width:768px)" :srcset="slide.mb || slide.pc" />
                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                        </picture>
                    </a>
                </template>
                <template v-if="store.status != 'edit'">
                    <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                       :target="[slide.url ? '_blank' : '']">
                        <picture>
                            <source media="(max-width:768px)" :srcset="slide.mb || slide.pc" />
                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                        </picture>
                    </a>
                </template>
            </swiper-slide>
        </swiper>
    </div>
</template>
