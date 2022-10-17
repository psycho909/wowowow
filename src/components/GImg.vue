<script>
export default {
    name: "GImg",
    label: "圖片區塊"
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
const props = defineProps(["data"])
let showEdit = ref(false);
let _imgDataLength = 1;
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let imgSetting = ref({})
let imgData = reactive({
    num: 1,
    imgs: [{
        pc: "",
        mb: "",
        type: "",
        pop: {
            show: false,
        },
        target: {}
    }],
})
let styleOptions = [{ value: "blue", text: "一" }, { value: "red", text: "二" }]
var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);

watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (content.value.body[_index]) {
        Object.keys(props.data.content).forEach((v, i) => {
            imgData[v] = props.data.content[v];
            imgSetting.value[v] = props.data.content[v];
            _imgDataLength = imgData.num
        })
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            imgData[v] = props.data.content[v];
            imgSetting.value[v] = props.data.content[v];
        })
    }
})

const openPop = (data) => {
    data.pop.show = true
}
const onChange = (e) => {
    let num = e.target.value;
    if (_imgDataLength <= num) {
        for (let i = 0; i < (num - _imgDataLength); i++) {
            imgData.imgs.push({
                pc: "",
                mb: "",
                type: "",
                pop: {
                    show: false,
                },
                target: {}
            })
        }
        _imgDataLength = num
    } else {
        imgData.imgs = imgData.imgs.slice(0, num)
    }
}

const onSubmit = () => {
    let data = { ...imgData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            imgData[v] = props.data.content[v];
            imgSetting.value[v] = props.data.content[v];
        })
    } else {
        imgData = {
            num: 1,
            imgs: [{
                pc: "",
                mb: "",
                type: "",
                pop: {
                    show: false,
                },
                target: {}
            }],
        }
    }
}
</script>
<template>
    <div class="g-img">
        <div class="g-img-container" :data-num="imgSetting.num">
            <template v-for="imgs in imgSetting.imgs">
                <a v-if="imgs.type == 'target'" :href="[imgs.target.link?imgs.target.link:'javascript:;']"
                   :target="[imgs.target.attribute?'_blank':'_self']" class="g-img__box">
                    <picture>
                        <source media="(max-width:768px)" :srcset="imgs.mb" />
                        <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                    </picture>
                </a>
                <a v-if="imgs.type == 'pop'" href="javascript:;" class="g-img__box" @click="openPop(imgs)">
                    <picture>
                        <source media="(max-width:768px)" :srcset="imgs.mb" />
                        <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                    </picture>
                    <g-lightbox v-model:showLightbox="imgs.pop.show" :style="imgs.pop.style">
                        <template #lightbox-title>{{imgs.pop.title}}</template>
                        <template #lightbox-content>
                            <div class="g-lightbox__text" v-if="imgs.pop.text" v-html="imgs.pop.text"></div>
                            <div class="g-lightbox__img" v-if="imgs.pop.img">
                                <img :src="imgs.pop.img" alt="">
                            </div>
                        </template>
                    </g-lightbox>
                </a>
            </template>
            <g-modify :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">圖片區塊<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__col">
                    <div class="edit-radio__title">選擇圖片框樣式:</div>
                    <g-radio label="單一圖片" name="img" value="1" v-model="imgData.num" @change="onChange" />
                    <g-radio label="兩格圖片" name="img" value="2" v-model="imgData.num" @change="onChange" />
                    <g-radio label="三格圖片" name="img" value="3" v-model="imgData.num" @change="onChange" />
                    <g-radio label="四格圖片" name="img" value="4" v-model="imgData.num" @change="onChange" />
                </div>
                <div class="edit-img__box" v-for="(img,index) in imgData.imgs">
                    <g-input label="*圖片網址:" v-model="img.pc" :preview="img.pc" />
                    <div class="g-edit__col">
                        <div class="edit-radio__title">開啟方式:</div>
                        <g-radio label="無" :name="'type'+index" value="" v-model="img.type" />
                        <g-radio label="POP視窗" :name="'type'+index" value="pop" v-model="img.type" />
                        <g-radio label="連結跳轉" :name="'type'+index" value="target" v-model="img.type" />
                    </div>
                    <template v-if="img.type == 'pop'">
                        <div class="g-edit__col">
                            <div class="edit-radio__title">POP內容:</div>
                            <g-radio label="純文字" :name="'popType'+index" value="text" v-model="img.pop.type" />
                            <g-radio label="圖片" :name="'popType'+index" value="img" v-model="img.pop.type" />
                        </div>
                        <div class="g-edit__col">
                            <g-input label="*POP標題:" v-model="img.pop.title" />
                        </div>
                        <template v-if="img.pop.type == 'text'">
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :options="styleOptions" v-model="img.pop.style" />
                            </div>
                            <div class="g-edit__col">
                                <g-ckedit v-model="img.pop.text" />
                            </div>
                        </template>
                        <template v-if="img.pop.type == 'img'">
                            <div class="g-edit__col">
                                <g-input label="*POP圖片:" v-model="img.pop.img" :preview="img.pop.img" />
                            </div>
                        </template>
                    </template>
                    <template v-if="img.type == 'link'">
                        <div class="dit-input__box">
                            <g-input label="連結內容:" v-model="img.target.link" />
                        </div>
                        <div class="g-edit__col">
                            <div class="edit-radio__title">另開視窗:</div>
                            <g-radio label="是" :name="'attribute'+index" :value="true" v-model="img.target.attribute" />
                            <g-radio label="否" :name="'attribute'+index" :value="false"
                                     v-model="img.target.attribute" />
                        </div>
                    </template>

                    <g-input label="手機圖片網址:" v-model="img.mb" :preview="img.mb" />
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>