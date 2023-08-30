<script>
export default {
    name: "GSlide2",
    label: "輪播區塊2",
    order: 4
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSwiper from '../elements/GSwiper.vue';
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl, imgLoading, handleNumber } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let slideSetting = reactive({});
let slideUpdate = ref(false);
let loading = ref(true);
let slideData = reactive({})
let slideNumValid = ref(true);
const initData = () => {
    return {
        num: 1, mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0, autoplay: {
            open: false,
            delay: 2,
            validDelay: true
        },
        slides: [{
            pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
        }],
    }
};
Object.assign(slideData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(slideData, cloneDeep(props.data.content));
            Object.assign(slideSetting, cloneDeep(props.data.content));
            imgLoading(slideData.slides).then((res) => {
                loading.value = false;
            })
        }
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(slideData, cloneDeep(props.data.content));
        Object.assign(slideSetting, cloneDeep(props.data.content));
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
    }
})

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const addInsertMenu = (index) => {
    if (index == slideData.slides.length) {
        slideData.slides.push({
            pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
        })
        if (slideData.num > slideData.slides.length) {
            slideData.num = slideData.slides.length;
        }
        return;
    }
    slideData.slides = [...slideData.slides.slice(0, index + 1), {
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    }, ...slideData.slides.slice(index + 1)];
    if (slideData.num > slideData.slides.length) {
        slideData.num = slideData.slides.length;
    }
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        slideData.slides = slideData.slides.slice(0, slideData.slides.length - 1)
    } else {
        slideData.slides = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)]
    }
    if (slideData.num > slideData.slides.length) {
        slideData.num = slideData.slides.length;
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = slideData.slides[index];
    var _content = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)];
    slideData.slides = _content;
    slideData.slides.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index + 1 >= slideData.slides.length) {
        return;
    }
    var _temp = slideData.slides[index];
    var _content = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)];
    slideData.slides = _content;
    slideData.slides.splice(index + 1, 0, _temp);
}

const onSubmit = async () => {
    let data = {}
    var validDelay;
    for (let i = 0; i < slideData.slides.length; i++) {
        if (slideData.slides[i].pc.length == 0) {
            slideData.slides[i].validPC = false;
        } else {
            if (!await CheckImage(slideData.slides[i].pc)) {
                slideData.slides[i].validPC = false;
            } else {
                slideData.slides[i].validPC = true;
            }
        }

        if (slideData.slides[i].mobile.length > 0) {
            if (!await CheckImage(slideData.slides[i].mobile)) {
                slideData.slides[i].validMobile = false;
            } else {
                slideData.slides[i].validMobile = true;
            }
        } else {
            slideData.slides[i].validMobile = true;
        }

        if (slideData.slides[i].url.length > 0) {
            if (!CheckUrl(slideData.slides[i].url)) {
                slideData.slides[i].validUrl = false;
            } else {
                slideData.slides[i].validUrl = true;
            }
        } else {
            slideData.slides[i].validUrl = true;
        }
    }

    if (slideData.autoplay.open) {
        if (isNaN(Number(slideData.autoplay.delay))) {
            slideData.autoplay.validDelay = false;
            validDelay = false;
        } else {
            slideData.autoplay.validDelay = true;
            validDelay = true;
        }
    } else {
        validDelay = true;
    }
    var validCheck = slideData.slides.every(function (v, i) {
        return v.validPC == true && v.validMobile == true && v.validUrl == true;
    })
    if (slideData.slides.length >= Number(slideData.num)) {
        slideNumValid.value = true;
    } else {
        slideNumValid.value = false;
    }
    if (validCheck && validDelay && slideNumValid.value) {
        $("#loadingProgress").show();
        let data = cloneDeep(slideData);
        store.updateCpt(props.data.uid, data);
        Object.assign(slideSetting, data);
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;
    }
}
const onReset = () => {
    Object.assign(slideData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(slideData, cloneDeep(props.data.content));
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
    } else {
        Object.assign(slideData, initData());
    }
    showEdit.value = false;
    props.data.update = false;
}

</script>
<template>
    <div class="g-slide" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-slide-container" :data-num="slideSetting.num">
            <template v-if="!loading"><g-swiper :data="slideSetting" :status="status" v-if="!slideUpdate" /></template>
            <template v-else>
                <div class="g-swiper"></div>
            </template>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">輪播區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Slide.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇輪播數量:</div>
                    <g-radio label="單格輪播" name="item" value="1" v-model="slideData.num" />
                    <g-radio label="雙格輪播" name="item" value="2" v-model="slideData.num" />
                    <g-radio label="三格輪播" name="item" value="3" v-model="slideData.num" />
                    <g-radio label="四格輪播" name="item" value="4" v-model="slideData.num" />
                    <div class="error" v-if="!slideNumValid">放置圖片數量不得小於所選輪播數量</div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label required">自動輪播:</div>
                        <g-radio label="開啟" name="open" :value="true" v-model="slideData.autoplay.open" />
                        <g-radio label="關閉" name="open" :value="false" v-model="slideData.autoplay.open" />
                    </div>
                    <div class="g-edit__col" v-if="slideData.autoplay.open == 'true'">
                        <g-input label="秒數:" v-model="slideData.autoplay.delay" :valid="slideData.autoplay.validDelay"
                                 :required="true" />
                    </div>
                </div>
                <div class="g-edit__row" v-for="(slide, index) in slideData.slides">
                    <div class="g-edit__col">
                        <div class="g-edit__group">
                            <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                            <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                            <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                            <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                        </div>
                        <div class="g-edit__group">
                            <div class="g-edit__col">
                                <g-input label="圖片網址:" v-model.trim="slide.pc" :valid="slide.validPC"
                                         :preview="slide.pc"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label required">開啟方式:</div>
                                <g-radio label="無" :name="'open' + index" :value="false" v-model="slide.open" />
                                <g-radio label="連結跳轉" :name="'open' + index" :value="true" v-model="slide.open" />
                            </div>
                            <template v-if="slide.open == 'true'">
                                <div class="g-edit__col">
                                    <g-input label="連結" v-model.trim="slide.url" :valid="slide.validUrl" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">另開視窗:</div>
                                    <g-radio label="是" :name="'attribute' + index" :value="true"
                                             v-model="slide.attribute" />
                                    <g-radio label="否" :name="'attribute' + index" :value="false"
                                             v-model="slide.attribute" />
                                </div>
                            </template>
                            <div class="g-edit__col">
                                <g-input label="手機版圖片網址" v-model.trim="slide.mobile" :preview="slide.mobile"
                                         :valid="slide.validMobile" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="slideData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="slideData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="slideData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="slideData.mobile_mb" @change="handleNumber" />
                    </div>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>