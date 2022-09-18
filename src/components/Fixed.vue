<script>
export default {
    name: "Fixed",
    label: "浮動式選單"
}
</script>
<script setup>
import { Chrome } from '@ckpack/vue-color';
import { storeToRefs } from "pinia";
import { nextTick } from 'vue';
import { mainStore } from "../store/index";
const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
let showEdit = ref(false);
let picker = ref(null)
let bgColors = ref("#194D33A8")
let textColors = ref("#194D33A8")
const position = computed(() => {
    var top = props.content.top ? `top:0px;` : `bottom:0px;`;
    var left = props.content.left ? `left:0px;` : `right:0px;`;
    return top + left;
})

onMounted(async () => {
    var _uid = content.value.body.findIndex((v, i) => v.uid == props.content.uid);
    if (!content.value.body[_uid].update) {
        showEdit.value = true;
    }
    await nextTick()
    console.log("onMounted")
})
const showPicker = () => {
    console.log("showPicker", colors.value)
}
onUpdated(() => {
    console.log("onUpdated")
})
onUnmounted(() => {
    console.log("destroyed")
})
</script>
<template>
    <div class="box fixed" :style="position" :data-uid="content.uid">
        <div>fixed {{content.uid}} </div>
        <Control :uid="content.uid" />
        <Edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動式選單</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-radio__box">
                    <div class="edit-radio__title">選擇出現位置:</div>
                    <label for="" class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">左</span>
                        <span class="edit-radio__style"></span>
                    </label>
                    <label for="" class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">右</span>
                        <span class="edit-radio__style"></span>
                    </label>
                    <label for="" class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">上</span>
                        <span class="edit-radio__style"></span>
                    </label>
                    <label for="" class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">下</span>
                        <span class="edit-radio__style"></span>
                    </label>
                </div>
                <div class="edit-style__box">
                    <div class="edit-bg__box">
                        <label for="">
                            <span @click="showPicker">背景色</span>
                            <div id="picker" ref="picker">
                                <Chrome v-model="bgColors" />
                            </div>
                        </label>
                    </div>
                    <div class="edit-bg__box">
                        <label for="">
                            <span @click="showPicker">文字顏色</span>
                            <div id="picker" ref="picker">
                                <Chrome v-model="textColors" />
                            </div>
                        </label>
                    </div>
                </div>
                <div class="edit-num__box">
                    <span class="edit-num__title">選單數目</span>
                    <input type="number" class="edit-num__input">
                    <a href="javascript:;" class="edit-num__add"></a>
                    <a href="javascript:;" class="edit-num__remove"></a>
                </div>
                <div class="edit-col__box">
                    <input type="text" class="edit-col__text" placeholder="請輸入選單文字">
                    <input type="text" class="edit-col__link" placeholder="請輸入連結或URL">
                    <a href="javascript:;" class="edit-col__remove"></a>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </Edit>
    </div>
</template>