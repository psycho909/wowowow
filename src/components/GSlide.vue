<script>
export default {
    name: "GSlide",
    label: "輪播圖",
    order: 4
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSwiper from '../elements/GSwiper.vue';
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl } from "../Tool";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content, page } = storeToRefs(store);
let slideSetting = ref({})
let slideData = reactive({
    num: 1, mt: 0, mb: 54,
    slides: [{
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    }],
})
watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (props.data) {
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
        }

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
        return;
    }
    slideData.slides = [...slideData.slides.slice(0, index + 1), {
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    }, ...slideData.slides.slice(index + 1)];
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        slideData.slides = slideData.slides.slice(0, slideData.slides.length - 1)
    } else {
        slideData.slides = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)]
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

    var validCheck = slideData.slides.every(function (v, i) {
        return v.validPC == true && v.validMobile == true && v.validUrl == true;
    })
    if (validCheck) {
        data = { ...slideData }
        store.updateCpt(props.data.uid, data)
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
            num: 1, mt: 0, mb: 54,
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
            num: 1, mt: 0, mb: 54,
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
    <div class="g-slide" :style="cssVar">
        <div class="g-slide-container" :data-num="slideSetting.num">
            <g-swiper :data="slideSetting" :status="status" />
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">輪播區塊<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇輪播數量:</div>
                    <g-radio label="單張圖片" name="item" value="1" v-model="slideData.num" @change="onChange" />
                    <g-radio label="兩張圖片" name="item" value="2" v-model="slideData.num" @change="onChange" />
                    <g-radio label="三張圖片" name="item" value="3" v-model="slideData.num" @change="onChange" />
                    <g-radio label="四張圖片" name="item" value="4" v-model="slideData.num" @change="onChange" />
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
                                <g-input label="圖片網址:" v-model="slide.pc" :valid="slide.validPC" :preview="slide.pc"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label required">開啟方式:</div>
                                <g-radio label="無" :name="'open' + index" :value="false" v-model="slide.open" />
                                <g-radio label="連結跳轉" :name="'open' + index" :value="true" v-model="slide.open" />
                            </div>
                            <template v-if="slide.open == 'true'">
                                <div class="g-edit__col">
                                    <g-input label="連結" v-model="slide.url" :valid="slide.validUrl" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">另開視窗:</div>
                                    <g-radio label="是" :name="'attribute' + index" :value="false"
                                             v-model="slide.attribute" />
                                    <g-radio label="否" :name="'attribute' + index" :value="true"
                                             v-model="slide.attribute" />
                                </div>
                            </template>
                            <div class="g-edit__col">
                                <g-input label="手機版圖片網址" v-model="slide.mobile" :preview="slide.mobile"
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