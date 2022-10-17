<script>
export default {
    name: "GSlide",
    label: "輪播物件"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSwiper from '../elements/GSwiper.vue';
import { mainStore } from "../store/index";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let slideSetting = ref({})
let slideData = reactive({
    num: 1,
    slides: [{
        pc: "", mb: "", open: false, url: "", attribute: false
    }],
})
var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);

watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (content.value.body[_index]) {
        Object.keys(props.data.content).forEach((v, i) => {
            slideData[v] = props.data.content[v];
            slideSetting.value[v] = props.data.content[v];
        })
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            slideData[v] = props.data.content[v];
            slideSetting.value[v] = props.data.content[v];
        })
    }
})

const openPop = (data) => {
    data.show = true
}

const onChange = (e) => {
    let num = e.target.value;
}

const addMenu = () => {
    slideData.slides.push({
        pc: "", mb: "", url: "", attribute: false
    })
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        slideData.slides = slideData.slides.slice(0, slideData.slides.length - 1)
    } else {
        slideData.slides = slideData.slides.slice(0, index)
    }
}

const onSubmit = () => {
    let data = { ...slideData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            slideData[v] = props.data.content[v];
            slideSetting.value[v] = props.data.content[v];
        })
    } else {
        slideData = {
            num: 1,
            slides: [{
                pc: "", mb: "", open: false, url: "", attribute: false
            }],
        }
    }
}

</script>
<template>
    <div class="g-slide">
        <div class="g-slide-container" :data-num="slideSetting.num">
            <g-swiper :data="slideSetting" />
            <g-modify :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-content>
                {{slideData}}
                <div class="edit-title__box">
                    <div class="edit-title__text">輪播區塊<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__col">
                    <div class="edit-radio__title">選擇輪播數量:</div>
                    <g-radio label="單張圖片" name="slide" value="1" v-model="slideData.num" @change="onChange" />
                    <g-radio label="兩張圖片" name="slide" value="2" v-model="slideData.num" @change="onChange" />
                    <g-radio label="三張圖片" name="slide" value="3" v-model="slideData.num" @change="onChange" />
                    <g-radio label="四張圖片" name="slide" value="4" v-model="slideData.num" @change="onChange" />
                </div>
                <div class="edit-input__group" v-for="(slide,index) in slideData.slides">
                    <div class="g-edit__col">
                        <g-input label="*圖片網址" v-model="slide.pc" />
                    </div>
                    <div class="g-edit__col">
                        <div class="edit-radio__title">開啟方式:</div>
                        <g-radio label="無" :name="'open'+index" :value="false" v-model="slide.open" />
                        <g-radio label="連結跳轉" :name="'open'+index" :value="true" v-model="slide.open" />
                    </div>
                    <template v-if="slide.open">
                        <div class="g-edit__col">
                            <g-input label="URL" v-model="slide.url" />
                        </div>
                        <div class="g-edit__col">
                            <div class="edit-radio__title">另開視窗:</div>
                            <g-radio label="是" :name="'attribute'+index" :value="false" v-model="slide.attribute" />
                            <g-radio label="否" :name="'attribute'+index" :value="true" v-model="slide.attribute" />
                        </div>
                    </template>
                    <div class="g-edit__col">
                        <g-input label="手機版圖片網址" v-model="slide.mb" />
                    </div>
                    <a href="javascript:;" class="icon icon-add" @click="addMenu"></a>
                    <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>