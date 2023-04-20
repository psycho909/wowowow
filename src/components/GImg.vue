<script>
export default {
    name: "GImg",
    label: "圖片區塊",
    order: 5
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GCkedit from '../elements/GCkedit.vue';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import { mainStore } from "../store/index";
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber } from "../Tool";
import { cloneDeep } from 'lodash-es'
const props = defineProps(["data"])
let showEdit = ref(false);
let _imgDataLength = ref(1);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let imgSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
let imgData = reactive({});
const initData = () => {
    return {
        num: 1,
        imgs: [{
            pc: "",
            mobile: "",
            type: "",
            validPC: true,
            validMobile: true,
            pop: {
                show: false, type: "text",
                align: "left",
                style: ""
            },
            target: {
                link: "",
                attribute: true, validUrl: true,
            }
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(imgData, initData());
watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(imgData, cloneDeep(props.data.content));
            Object.assign(imgSetting, cloneDeep(props.data.content));
            _imgDataLength.value = imgData.num;
            imgLoading(imgData.imgs).then((res) => {
                loading.value = false;
            })
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(imgData, cloneDeep(props.data.content));
        Object.assign(imgSetting, cloneDeep(props.data.content));
        _imgDataLength.value = imgData.num;
        imgLoading(imgData.imgs).then((res) => {
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

const openPop = (data) => {
    data.pop.show = true
}
const onChange = (e) => {
    let num = e.target.value;
    if (_imgDataLength.value <= num) {
        for (let i = 0; i < (num - _imgDataLength.value); i++) {
            imgData.imgs.push({
                pc: "",
                mobile: "",
                type: "",
                validPC: true, validMobile: true,
                pop: {
                    show: false,
                    type: "text",
                    align: "left",
                    style: ""
                },
                target: {
                    link: "",
                    attribute: true, validUrl: true,
                }
            })
        }
    } else {
        imgData.imgs = imgData.imgs.slice(0, num)
    }
    _imgDataLength.value = num;
}

const onSubmit = async () => {
    let data = {}

    for (let i = 0; i < imgData.imgs.length; i++) {
        if (imgData.imgs[i].pc.length == 0) {
            imgData.imgs[i].validPC = false;
        } else {
            if (!await CheckImage(imgData.imgs[i].pc)) {
                imgData.imgs[i].validPC = false;
            } else {
                imgData.imgs[i].validPC = true;
            }
        }

        if (imgData.imgs[i].mobile.length > 0) {
            if (!await CheckImage(imgData.imgs[i].mobile)) {
                imgData.imgs[i].validMobile = false;
            } else {
                imgData.imgs[i].validMobile = true;
            }
        } else {
            imgData.imgs[i].validMobile = true;
        }
        if (imgData.imgs[i].target.link.length > 0) {
            if (!CheckUrl(imgData.imgs[i].target.link)) {
                imgData.imgs[i].target.validUrl = false;
            } else {
                imgData.imgs[i].target.validUrl = true;
            }
        } else {
            imgData.imgs[i].target.validUrl = true;
        }
    }

    if (imgData.style == "") {
        styleValid.value = false;
    } else {
        styleValid.value = true;
    }
    var validCheck = imgData.imgs.every(function (v, i) {
        return v.validPC == true && v.validMobile == true && v.target.validUrl == true;
    })
    if (validCheck && styleValid.value) {
        $("#loadingProgress").show();
        let data = cloneDeep(imgData);
        store.updateCpt(props.data.uid, data);
        Object.assign(imgSetting, data);
        imgLoading(imgData.imgs).then((res) => {
            loading.value = false;
        })
    }
}
const onReset = () => {
    _imgDataLength.value = 1;
    Object.assign(imgData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(imgData, cloneDeep(props.data.content));
        _imgDataLength.value = imgData.num;
        imgLoading(imgData.imgs).then((res) => {
            loading.value = false;
        })
    } else {
        Object.assign(imgData, initData());
    }
    showEdit.value = false;
    props.data.update = false;
}
</script>
<template>
    <div class="g-img" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-img-container" :data-num="imgSetting.num">
            <template v-if="!loading" v-for="imgs in imgSetting.imgs">
                <template v-if="imgs.type == 'link' && store.status != 'edit'">
                    <a :href="[imgs.target.link ? imgs.target.link : 'javascript:;']"
                       :target="[imgs.target.attribute == true ? '_blank' : '_self']" class="g-img__box"
                       :class="imgs.type ? '' : 'none'">
                        <picture>
                            <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                            <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                        </picture>
                    </a>
                </template>
                <template v-if="imgs.type == 'link' && store.status == 'edit'">
                    <a :href="[imgs.target.link ? imgs.target.link : 'javascript:;']"
                       :target="[imgs.target.attribute == true ? '_blank' : '_blank']" class="g-img__box"
                       :class="imgs.type ? '' : 'none'">
                        <picture>
                            <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                            <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                        </picture>
                    </a>
                </template>
                <a v-if="imgs.type == 'pop'" href="javascript:;" class="g-img__box" :class="imgs.type ? '' : 'none'"
                   @click="openPop(imgs)">
                    <picture>
                        <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                        <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                    </picture>
                    <g-lightbox v-model:showLightbox="imgs.pop.show" :style="colors[imgs.pop.style]"
                                :class="imgs.pop.align">
                        <template #lightbox-title>{{ imgs.pop.title }}</template>
                        <template #lightbox-content>
                            <div class="g-lightbox__text" v-if="imgs.pop.text"
                                 v-html="imgs.pop.text"></div>
                            <div class="g-lightbox__img" v-if="imgs.pop.img">
                                <img :src="imgs.pop.img" alt="">
                            </div>
                        </template>
                    </g-lightbox>
                </a>
                <a v-if="imgs.type == ''" href="javascript:;" class="g-img__box" :class="imgs.type ? '' : 'none'">
                    <picture>
                        <source media="(max-width:768px)" :srcset="imgs.mobile" />
                        <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                    </picture>
                </a>
            </template>
            <template v-else>
                <div class="g-img__box"></div>
            </template>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">圖片區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">圖片樣式:</div>
                    <g-radio label="單一圖片" name="img" value="1" v-model="imgData.num" @change="onChange" />
                    <g-radio label="兩格圖片" name="img" value="2" v-model="imgData.num" @change="onChange" />
                    <g-radio label="三格圖片" name="img" value="3" v-model="imgData.num" @change="onChange" />
                    <g-radio label="四格圖片" name="img" value="4" v-model="imgData.num" @change="onChange" />
                </div>
                <div class="g-edit__row g-edit__block" v-for="(img, index) in imgData.imgs">
                    <div class="g-edit__col">
                        <g-input label="圖片網址:" v-model.trim="img.pc" :preview="img.pc" :required="true"
                                 :valid="img.validPC" />
                    </div>
                    <div class="g-edit__col">
                        <div class="input-group__label required">開啟方式:</div>
                        <g-radio label="無" :name="'type' + index" value="" v-model="img.type" />
                        <g-radio label="POP視窗" :name="'type' + index" value="pop" v-model="img.type" />
                        <g-radio label="連結跳轉" :name="'type' + index" value="link" v-model="img.type" />
                    </div>
                    <template v-if="img.type == 'pop'">
                        <div class="g-edit__col">
                            <div class="input-group__label required">POP內容:</div>
                            <g-radio label="純文字" :name="'popType' + index" value="text" v-model="img.pop.type" />
                            <g-radio label="圖片" :name="'popType' + index" value="img" v-model="img.pop.type" />
                        </div>
                        <div class="g-edit__col">
                            <g-input label="POP標題:" v-model="img.pop.title" />
                        </div>
                        <template v-if="img.pop.type == 'text'">
                            <div class="g-edit__row">
                                <div class="input-group__label required">對齊方向:</div>
                                <g-radio label="左" :name="'align' + index" value="left" v-model="img.pop.align" />
                                <g-radio label="中" :name="'align' + index" value="center" v-model="img.pop.align" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="styleValid"
                                          v-model="img.pop.style" />
                            </div>
                            <div class="g-edit__col">
                                <g-ckedit v-model="img.pop.text" />
                            </div>
                        </template>
                        <template v-if="img.pop.type == 'img'">
                            <div class="g-edit__col">
                                <g-input label="POP圖片網址:" v-model.trim="img.pop.img" :preview="img.pop.img"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="styleValid"
                                          v-model="img.pop.style" />
                            </div>
                        </template>
                    </template>
                    <template v-if="img.type == 'link'">
                        <div class="g-edit__col">
                            <g-input label="連結:" :required="true" v-model.trim="img.target.link"
                                     :valid="img.target.validUrl" />
                        </div>
                        <div class="g-edit__col">
                            <div class="input-group__label">另開視窗:</div>
                            <g-radio label="是" :name="'attribute' + index" :value="true"
                                     v-model="img.target.attribute" />
                            <g-radio label="否" :name="'attribute' + index" :value="false"
                                     v-model="img.target.attribute" />
                        </div>
                    </template>

                    <g-input label="手機圖片網址:" v-model.trim="img.mobile" :preview="img.mobile" :valid="img.validMobile" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="imgData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="imgData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="imgData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="imgData.mobile_mb" @change="handleNumber" />
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