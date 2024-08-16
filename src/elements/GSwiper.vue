<script setup>
// Import Swiper Vue.js components
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { mainStore } from "../store/index";
import GSwiper from './GSwiper2.vue';
import GLightbox from '../components/GLightbox.vue';
import colors, { style1, style2 } from "../colors";
const props = defineProps(["data", "status"]);
const store = mainStore()
let breakpoints = ref({})
let slidesPerViewThumb = ref(null)
let autoplay = ref({});
let isMobile = ref(false);
let navigation = ref(true);
let slideUpdate = ref(false);
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


if (document.querySelector("HTML").getAttribute("data-type") == 2) {
    breakpoints.value = {
        769: {
            slidesPerView: Number(props.data.num),
            slidesPerGroup: props.data?.group == true || props.data?.group == 'true' ? Number(props.data.num) : 1, // 一次滑動幾個
            spaceBetween: 0,
            centeredSlides: false
        }
    }
} else {
    breakpoints.value = {
        769: {
            slidesPerView: Number(props.data.num),
            slidesPerGroup: props.data?.group == true || props.data?.group == 'true' ? Number(props.data.num) : 1, // 一次滑動幾個
            spaceBetween: 16,
            centeredSlides: false
        }
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
const modules = [Navigation, Pagination, Autoplay, EffectCoverflow];

if (props.data?.control) {
    if (props.data.control == 'navigation') {
        pagination.value.enabled = false;
    }
    if (props.data.control == 'all') {
        if (props.data.thumb == 'true' || props.data.thumb == true) {
            pagination.value.enabled = false;
            slidesPerViewThumb.value = props.data.slides.length
        } else {
            pagination.value.enabled = true;
            navigation.value = true;
        }
    }
    if (props.data.control == 'pagination') {
        if (props.data.thumb == 'true' || props.data.thumb == true) {
            navigation.value = false;
            pagination.value.enabled = false;
            slidesPerViewThumb.value = props.data.slides.length
        } else {
            navigation.value = false;
        }
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
const closePop = (data, url) => {
    if (store.page == "EditPage") {
        data.pop.show = false
    } else {
        window.location.href = url;
    }
}
const openPop = (data) => {
    data.pop.show = true
}

watchEffect(async () => {
    slideUpdate.value = true;
    await nextTick();
    slideUpdate.value = false;
})
</script>
<template>
    <div class="g-swiper">
        <template v-if="isMobile">
            <swiper
                    :modules="modules"
                    :slidesPerView="1"
                    :loop="true"
                    :navigation="navigation"
                    :pagination="pagination"
                    :autoplay="autoplay"
                    :set-wrapper-size="true"
                    @swiper="onSwiper">
                <swiper-slide v-for="slide in data.slides">
                    <template v-if="store.status == 'edit'">
                        <div class="g-swiper__a edit">
                            <div class="g-swiper__img-box">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </div>
                            <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                <div class="g-swiper__card">
                                    <div class="g-swiper__card-body"
                                         v-if="slide.card.title !== '' || slide.card.text !== ''">
                                        <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{ slide.card.title
                                        }}</div>
                                        <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                             v-html="slide.card.text"></div>
                                    </div>
                                    <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                       :target="[slide.url ? '_blank' : '']"
                                       v-if="slide.card.url !== '' && slide.type == 'link'">{{ slide.card.url }}</a>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-if="store.status != 'edit'">
                        <template v-if="slide.type == 'pop'">
                            <div class="g-swiper__a" @click="openPop(slide)">
                                <div class="g-swiper__img-box"
                                     :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                    </picture>
                                    <template v-if="slide.effectCheck == 'true'">
                                        <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                    </template>
                                </div>
                                <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                    <div class="g-swiper__card">
                                        <div class="g-swiper__card-body"
                                             v-if="slide.card.title !== '' || slide.card.text !== ''">
                                            <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                slide.card.title
                                            }}</div>
                                            <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                 v-html="slide.card.text"></div>
                                        </div>
                                        <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                           :target="[slide.attribute == 'true' || slide.attribute == true ? '_blank' : '']"
                                           v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                    </div>
                                </template>
                                <g-lightbox v-model:showLightbox="slide.pop.show" :style="colors[slide.pop.style]"
                                            :class="[slide.pop.align, slide.pop.type, slide.pop.type == 'slide' ? 'pop-slide' : '']">
                                    <template #lightbox-close v-if="slide.pop.closeCheckRedirect == 'true'">
                                        <a href="javascript:;" class="g-lightbox__close icon-close"
                                           @click="closePop(slide, slide.pop.closeRedirect)"></a>
                                    </template>
                                    <template #lightbox-title v-if="slide.pop.type != 'slide'">{{
                                        slide.pop.title }}</template>
                                    <template #lightbox-content>
                                        <template v-if="slide.pop.type != 'slide'">
                                            <div class="g-lightbox__text" v-if="slide.pop.text"
                                                 v-html="slide.pop.text"></div>
                                            <div class="g-lightbox__img" v-if="slide.pop.img">
                                                <img :src="slide.pop.img" alt="">
                                            </div>
                                        </template>
                                        <template v-else>
                                            <g-swiper :data="slide.pop" :status="status" v-if="!slideUpdate" />
                                        </template>
                                    </template>
                                </g-lightbox>
                            </div>
                        </template>
                        <template v-if="slide.type == 'link' || slide.url != ''">
                            <template v-if="slide.card.url != ''">
                                <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                                   :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                    <div class="g-swiper__img-box"
                                         :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                        <picture>
                                            <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                        </picture>
                                        <template v-if="slide.effectCheck == 'true'">
                                            <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                        </template>
                                    </div>
                                    <template
                                              v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                        <div class="g-swiper__card">
                                            <div class="g-swiper__card-body"
                                                 v-if="slide.card.title !== '' || slide.card.text !== ''">
                                                <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                    slide.card.title }}</div>
                                                <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                     v-html="slide.card.text"></div>
                                            </div>
                                            <a class="g-swiper__card-link"
                                               v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                        </div>
                                    </template>
                                </a>
                            </template>
                            <template v-else>
                                <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                                   :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                    <div class="g-swiper__img-box"
                                         :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                        <picture>
                                            <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                        </picture>
                                        <template v-if="slide.effectCheck == 'true'">
                                            <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                        </template>
                                    </div>
                                    <template
                                              v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                        <div class="g-swiper__card">
                                            <div class="g-swiper__card-body"
                                                 v-if="slide.card.title !== '' || slide.card.text !== ''">
                                                <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                    slide.card.title }}</div>
                                                <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                     v-html="slide.card.text"></div>
                                            </div>
                                            <a class="g-swiper__card-link"
                                               v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                        </div>
                                    </template>
                                </a>
                            </template>
                        </template>
                        <template v-if="slide.type == '' || slide.type == undefined">
                            <div class="g-swiper__a">
                                <div class="g-swiper__img-box"
                                     :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                    </picture>
                                    <template v-if="slide.effectCheck == 'true'">
                                        <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                    </template>
                                </div>
                                <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                    <div class="g-swiper__card">
                                        <div class="g-swiper__card-body"
                                             v-if="slide.card.title !== '' || slide.card.text !== ''">
                                            <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                slide.card.title
                                            }}</div>
                                            <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                 v-html="slide.card.text"></div>
                                        </div>
                                        <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                           :target="[slide.attribute == 'true' || slide.attribute == true ? '_blank' : '']"
                                           v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                    </div>
                                </template>
                            </div>
                        </template>
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
                        <div class="g-swiper__a edit">
                            <div class="g-swiper__img-box">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                    <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                </picture>
                            </div>
                            <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                <div class="g-swiper__card">
                                    <div class="g-swiper__card-body"
                                         v-if="slide.card.title !== '' || slide.card.text !== ''">
                                        <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{ slide.card.title
                                        }}</div>
                                        <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                             v-html="slide.card.text"></div>
                                    </div>
                                    <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                       :target="[slide.url ? '_blank' : '']"
                                       v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-if="store.status != 'edit'">
                        <template v-if="slide.type == 'pop'">
                            <div class="g-swiper__a" @click="openPop(slide)" data-type="pop">
                                <div class="g-swiper__img-box"
                                     :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                    </picture>
                                    <template v-if="slide.effectCheck == 'true'">
                                        <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                    </template>
                                </div>
                                <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                    <div class="g-swiper__card">
                                        <div class="g-swiper__card-body"
                                             v-if="slide.card.title !== '' || slide.card.text !== ''">
                                            <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                slide.card.title
                                            }}</div>
                                            <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                 v-html="slide.card.text"></div>
                                        </div>
                                    </div>
                                </template>
                                <g-lightbox v-model:showLightbox="slide.pop.show" :style="colors[slide.pop.style]"
                                            :class="[slide.pop.align, slide.pop.type == 'slide' ? 'pop-slide' : '']">
                                    <template #lightbox-title v-if="slide.pop.type != 'slide'">{{
                                        slide.pop.title }}</template>
                                    <template #lightbox-content>
                                        <template v-if="slide.pop.type != 'slide'">
                                            <div class="g-lightbox__text" v-if="slide.pop.text"
                                                 v-html="slide.pop.text"></div>
                                            <div class="g-lightbox__img" v-if="slide.pop.img">
                                                <img :src="slide.pop.img" alt="">
                                            </div>
                                        </template>
                                        <template v-else>
                                            <g-swiper :data="slide.pop" :status="status" v-if="!slideUpdate" />
                                        </template>
                                    </template>
                                    <template #lightbox-btn v-if="slide.pop.closeCheckRedirect == 'true'">
                                        <a href="javascript:;" class="g-lightbox__btn"
                                           @click="closePop(slide, slide.pop.closeRedirect)">確定</a>
                                    </template>
                                    <template #lightbox-close v-if="slide.pop.closeCheckRedirect == 'true'">
                                        <a href="javascript:;" class="g-lightbox__close icon-close"
                                           @click="closePop(slide, slide.pop.closeRedirect)"></a>
                                    </template>
                                </g-lightbox>
                            </div>
                        </template>
                        <template v-if="slide.type == 'link'">
                            <template v-if="slide.card.url != ''">
                                <div class="g-swiper__a">
                                    <div class="g-swiper__img-box"
                                         :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                        <picture>
                                            <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                        </picture>
                                        <template v-if="slide.effectCheck == 'true'">
                                            <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                        </template>
                                    </div>
                                    <template
                                              v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                        <div class="g-swiper__card">
                                            <div class="g-swiper__card-body"
                                                 v-if="slide.card.title !== '' || slide.card.text !== ''">
                                                <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                    slide.card.title }}</div>
                                                <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                     v-html="slide.card.text"></div>
                                            </div>
                                            <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                               :target="[slide.attribute == 'true' || slide.attribute == true ? '_blank' : '']"
                                               v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                                <a class="g-swiper__a" :href="[slide.url ? slide.url : 'javascript:;']"
                                   :target="[slide.attribute == true || slide.attribute == 'true' ? '_blank' : '']">
                                    <div class="g-swiper__img-box"
                                         :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                        <picture>
                                            <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                            <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                        </picture>
                                        <template v-if="slide.effectCheck == 'true'">
                                            <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                        </template>
                                    </div>
                                    <template
                                              v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                        <div class="g-swiper__card">
                                            <div class="g-swiper__card-body"
                                                 v-if="slide.card.title !== '' || slide.card.text !== ''">
                                                <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                    slide.card.title }}</div>
                                                <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                     v-html="slide.card.text"></div>
                                            </div>
                                        </div>
                                    </template>
                                </a>
                            </template>
                        </template>
                        <template v-if="slide.type == '' || slide.type == undefined">
                            <div class="g-swiper__a">
                                <div class="g-swiper__img-box"
                                     :class="[slide.effectCheck == 'true' || slide.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="slide.mobile || slide.pc" />
                                        <img class="g-swiper__img" :srcset="slide.pc" :src="slide.pc" alt="" />
                                    </picture>
                                    <template v-if="slide.effectCheck == 'true'">
                                        <img :src="slide.effectImg" alt="" class="g-swiper__effectImg">
                                    </template>
                                </div>
                                <template v-if="slide.card.title !== '' || slide.card.text !== '' || slide.card.url !== ''">
                                    <div class="g-swiper__card">
                                        <div class="g-swiper__card-body"
                                             v-if="slide.card.title !== '' || slide.card.text !== ''">
                                            <div class="g-swiper__card-title" v-if="slide.card.title !== ''">{{
                                                slide.card.title
                                            }}</div>
                                            <div class="g-swiper__card-text" v-if="slide.card.text !== ''"
                                                 v-html="slide.card.text"></div>
                                        </div>
                                        <a class="g-swiper__card-link" :href="[slide.url ? slide.url : 'javascript:;']"
                                           :target="[slide.attribute == 'true' || slide.attribute == true ? '_blank' : '']"
                                           v-if="slide.card.url !== ''">{{ slide.card.url }}</a>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </template>
                </swiper-slide>
            </swiper>
        </template>
    </div>
</template>
