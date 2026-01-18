<!-- 只有主圖+縮圖普通版Swiper -->
<script setup>
import { Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, FreeMode } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { mainStore } from "../store/index";
const props = defineProps(["data", "status"]);
const store = mainStore()
console.log(props.data)
let breakpoints = ref({})
let slidesPerViewThumb = ref(null)
let autoplay = ref({});
let isMobile = ref(false);
let navigation = ref(true);
let currentSwiper = ref(null)
let currentIndex = ref(0);
let coverflowEffectValue = ref({ rotate: 50, depth: 200, modifier: 1, slideShadows: false })
let pagination = ref({
    clickable: true,
    enabled: true
});
let thumbsSwiper = ref(null)
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
    if (props.data?.autoplay?.open == true || props.data?.autoplay?.open == 'true') {
        autoplay.value = {
            delay: Number(props.data.autoplay.delay) * 1000,
            disableOnInteraction: false
        }
    } else {
        autoplay.value = false;
    }
} else {
    autoplay.value = false;
}
const modules = [Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, FreeMode];


if (props.data?.control) {
    if (props.data?.type) {
        if (props.data.type == 'slide') {
            if (props.data.control == 'navigation') {
                pagination.value.enabled = false;
            }
            if (props.data.control == 'pagination') {
                if (props.data.thumb == true || props.data.thumb == 'true') {
                    pagination.value.enabled = false;
                } else {
                    pagination.value.enabled = true;
                }
                navigation.value = false;
            }
            if (props.data.control == 'all') {
                if (props.data.thumb == true || props.data.thumb == 'true') {
                    pagination.value.enabled = false;
                } else {
                    pagination.value.enabled = true;
                }
            }
            if (props.data.control == 'no') {
                navigation.value = false;
                pagination.value.enabled = false;
            }
        }
    } else {
        if (props.data.control == 'navigation') {
            pagination.value.enabled = false;
        }
        if (props.data.control == 'pagination') {
            if (props.data.thumb != 'false') {
                navigation.value = false;
                pagination.value.enabled = false;
                slidesPerViewThumb.value = props.data.slides.length
            } else {
                navigation.value = false;
            }
        }
        if (props.data.control == 'all') {
            if (props.data.thumb == true || props.data.thumb == 'true') {
                pagination.value.enabled = false;
            } else {
                pagination.value.enabled = true;
            }
        }
        if (props.data.control == 'no') {
            navigation.value = false;
            pagination.value.enabled = false;
        }
    }
}

const onSwiper = (swiper) => {
    currentSwiper.value = swiper;
    if (!props.status) {
        swiper.disable()
    }
};
const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
};

const onSlideChange = (swiper) => {
    currentIndex.value = swiper.realIndex
}

const onChangeSlide = (index) => {
    currentSwiper.value.slideTo(index)
}
</script>
<template>
    <div class="g-swiper">
        <template v-if="isMobile">
            <template v-if="data.type == 'slide'">
                <swiper
                        :modules="modules"
                        :slidesPerView="1"
                        :thumbs="{ swiper: thumbsSwiper }"
                        :loop="true"
                        :navigation="navigation"
                        :pagination="pagination"
                        :autoplay="autoplay"
                        :set-wrapper-size="true"
                        @swiper="onSwiper">
                    <swiper-slide v-for="slide in data.slides">
                        <template v-if="store.status == 'edit'">
                            <a class=" g-swiper__a">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </a>
                        </template>
                        <template v-if="store.status != 'edit'">
                            <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                               :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </a>
                        </template>
                    </swiper-slide>
                </swiper>
                <swiper
                        v-if="data.control == 'pagination'"
                        :modules="modules"
                        :loop="true"
                        :slidesPerView="slidesPerViewThumb"
                        :watchSlidesProgress="true"
                        @swiper="setThumbsSwiper">
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
                               :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
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
                        :slidesPerView="1"
                        :thumbs="{ swiper: thumbsSwiper }"
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
                               :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </a>
                        </template>
                    </swiper-slide>
                </swiper>
            </template>
        </template>
        <template v-else>
            <template v-if="data.type == 'slide'">
                <swiper
                        :modules="modules"
                        :breakpoints="breakpoints"
                        :loop="true"
                        :navigation="navigation"
                        :pagination="pagination"
                        :autoplay="autoplay"
                        :set-wrapper-size="true"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange">
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
                               :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </a>
                        </template>
                    </swiper-slide>
                </swiper>
                <div class="swiper-thumb-box"
                     v-if="(data.control == 'pagination' || data.control == 'all') && data.thumb == 'true' || data.thumb == true">
                    <div class="swiper-thumb__item" v-for="(slide, index) in data.slides"
                         :class="[index == currentIndex ? 'active' : '']" @click="onChangeSlide(index + 1)">
                        <picture>
                            <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                            <img class="swiper-thumb__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                        </picture>
                    </div>
                </div>
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
                               :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </a>
                        </template>
                    </swiper-slide>
                </swiper>
            </template>
        </template>
    </div>
</template>
