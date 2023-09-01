<script setup>
// Import Swiper Vue.js components
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { mainStore } from "../store/index";
const props = defineProps(["data", "status"]);
const store = mainStore()
let breakpoints = ref({})
let autoplay = ref({});
let isMobile = ref(false);
let navigation = ref(true);
let pagination = ref({
    clickable: true,
    enabled: true
});
if (window.innerWidth < 769) {
    isMobile.value = true;
} else {
    isMobile.value = false;
}
breakpoints.value = {
    769: {
        slidesPerView: Number(props.data.num),
        slidesPerGroup: props.data?.group ? Number(props.data.num) : 1, // 一次滑動幾個
        spaceBetween: 16,
        centeredSlides: false
    }
}

if (props.data?.autoplay?.open) {
    autoplay.value = {
        delay: Number(props.data.autoplay.delay) * 1000,
        disableOnInteraction: false
    }
} else {
    autoplay.value = false;
}
const modules = [Navigation, Pagination, Autoplay, EffectCoverflow];
if (props.data?.control) {
    if (props.data.control == 'navigation') {
        pagination.value.enabled = false;
    }
    if (props.data.control == 'pagination') {
        navigation.value = false;
    }
    if (props.data.control == 'no') {
        navigation.value = false;
        pagination.value.enabled = false;
    }
}

const onSwiper = (swiper) => {
    if (!props.status) {
        swiper.disable()
    }
};
</script>
<template>
    <div class="g-swiper">
        <template v-if="isMobile">
            <swiper
                    :modules="modules"
                    :effect="'coverflow'"
                    :grabCursor="false"
                    :slidesPerView="'auto'"
                    :centered-slides="true"
                    :coverflowEffect="{ rotate: 50, depth: 200, modifier: 1, slideShadows: false }"
                    :loop="true"
                    :navigation="navigation"
                    :pagination="pagination"
                    :autoplay="autoplay"
                    :set-wrapper-size="true"
                    @swiper="onSwiper">
                <swiper-slide v-for="slide in data.slides">
                    <template v-if="store.status == 'edit'">
                        <a class=" g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                           :target="[slide.url ? '_blank' : '']">
                            <picture>
                                <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                            </picture>
                        </a>
                    </template>
                    <template v-if="store.status != 'edit'">
                        <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                           :target="[slide.url ? '_blank' : '']">
                            <picture>
                                <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                            </picture>
                        </a>
                    </template>
                </swiper-slide>
            </swiper>
        </template>
        <template v-else>
            <swiper
                    :modules="modules"
                    :breakpoints="breakpoints"
                    :loop-fill-group-with-blank="true"
                    :centered-slides="true"
                    :loop="true"
                    :navigation="navigation"
                    :pagination="pagination"
                    :autoplay="autoplay"
                    :set-wrapper-size="true"
                    @swiper="onSwiper">
                <swiper-slide v-for="slide in data.slides">
                    <template v-if="store.status == 'edit'">
                        <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                           :target="[slide.url ? '_blank' : '']">
                            <picture>
                                <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                            </picture>
                        </a>
                    </template>
                    <template v-if="store.status != 'edit'">
                        <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                           :target="[slide.url ? '_blank' : '']">
                            <picture>
                                <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                            </picture>
                        </a>
                    </template>
                </swiper-slide>
            </swiper>
        </template>
    </div>
</template>
