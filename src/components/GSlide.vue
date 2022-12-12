<script>
export default {
    name: "GSlide",
    label: "輪播區塊",
    order: 4
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSwiper from '../elements/GSwiper.vue';
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl, imgLoading } from "../Tool";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content, page } = storeToRefs(store);
let slideSetting = ref({});
let slideUpdate = ref(true);
let loading = ref(true);
let slideData = reactive({
    num: 1, mt: 0, mb: 54, autoplay: {
        open: false,
        delay: 2,
        validDelay: true
    },
    slides: [{
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    }],
})
if (window.sessionStorage.getItem("state")) {
    window.sessionStorage.removeItem("state")
}
watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (props.data) {
        slideUpdate.value = false;
        await nextTick();
        slideUpdate.value = true;
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        let _temp = { ...props.data.content };
        _temp.slides = [...props.data.content.slides];
        _temp.slides.forEach((v, i) => {
            _temp.slides[i] = { ...v };
        })
        let _temp2 = { ...props.data.content };
        _temp2.slides = [...props.data.content.slides];
        _temp2.slides.forEach((v, i) => {
            _temp2.slides[i] = { ...v };
        })
        Object.keys(_temp).forEach((v, i) => {
            slideData[v] = _temp[v];
        })
        Object.keys(_temp2).forEach((v, i) => {
            slideSetting.value[v] = _temp2[v];
        })
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
    }
})

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const openPop = (data) => {
    data.show = true
}

const onChange = (e) => {
    let num = e.target.value;
}

const addInsertMenu = (index) => {
    if (index == slideData.slides.length) {
        slideData.slides.push({
            pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
        })
        if (slideData.num > slideData.slides.length) {
            slideData.num = lideData.slides.length;
        }
        return;
    }
    slideData.slides = [...slideData.slides.slice(0, index + 1), {
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    }, ...slideData.slides.slice(index + 1)];
    if (slideData.num > slideData.slides.length) {
        slideData.num = lideData.slides.length;
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
    if (validCheck && validDelay) {
        data = { ...slideData }
        store.updateCpt(props.data.uid, data)
        Object.keys(data).forEach((v, i) => {
            slideSetting.value[v] = data[v];
        })
        slideUpdate.value = false;
        await nextTick();
        slideUpdate.value = true;
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
    }
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            slideData[v] = props.data.content[v];
            slideSetting.value[v] = props.data.content[v];
        })
    } else {
        slideData = {
            num: 1, mt: 0, mb: 54, autoplay: {
                open: false,
                delay: 2,
                validDelay: true
            },
            slides: [{
                pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
            }],
        }
    }
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            slideData[v] = props.data.content[v];
            slideSetting.value[v] = props.data.content[v];
        })
    } else {
        slideData = {
            num: 1, mt: 0, mb: 54, autoplay: {
                open: false,
                delay: 2,
                validDelay: true
            },
            slides: [{
                pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
            }]
        };
    }
    showEdit.value = false;
    props.data.update = false;
}

</script>
<template>
    <div class="g-slide" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-slide-container" :data-num="slideSetting.num">
            <template v-if="!loading"><g-swiper :data="slideSetting" :status="status" v-if="slideUpdate" /></template>
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
                    <g-radio label="單張圖片" name="item" value="1" v-model="slideData.num" />
                    <g-radio label="兩張圖片" name="item" value="2" v-model="slideData.num"
                             :disable="!(slideData.slides.length >= 2)" />
                    <g-radio label="三張圖片" name="item" value="3" v-model="slideData.num"
                             :disable="!(slideData.slides.length >= 3)" />
                    <g-radio label="四張圖片" name="item" value="4" v-model="slideData.num"
                             :disable="!(slideData.slides.length >= 4)" />
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
                        <g-input label="間距上:" type="number" v-model="slideData.mt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="間距下:" type="number" v-model="slideData.mb" />
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