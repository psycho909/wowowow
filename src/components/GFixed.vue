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
const props = defineProps(["data"])
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
    var _uid = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
    if (content.value.body[_uid].update) {
        showEdit.value = true;
    }
    await nextTick()

})
const showPicker = () => {
    console.log("showPicker", colors.value)
}
onUpdated(() => {

})
onUnmounted(() => {

})
</script>
<template>
    <div class="box fixed" :style="position" :data-uid="data.uid">
        <div>fixed {{data.uid}} </div>
        <g-modify :uid="data.uid" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動式選單</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-radio__box">
                    <div class="edit-radio__title">選擇出現位置:</div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">左</span>
                        <span class="edit-radio__style"></span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">右</span>
                        <span class="edit-radio__style"></span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">上</span>
                        <span class="edit-radio__style"></span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">下</span>
                        <span class="edit-radio__style"></span>
                    </div>
                </div>
                <div class="edit-style__box">
                    <div class="edit-bg__box">
                        <div>
                            <div @click="showPicker">背景色</div>
                            <div id="picker" ref="picker">
                                <Chrome v-model="bgColors" />
                            </div>
                        </div>
                    </div>
                    <div class="edit-bg__box">
                        <div>
                            <div @click="showPicker">文字顏色</div>
                            <div id="picker" ref="picker">
                                <Chrome v-model="textColors" />
                            </div>
                        </div>
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
        </g-edit>
    </div>
</template>