<script>
export default {
    name: "Slogan",
    label: "主標題圖片"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["content"])
let showEdit = ref(false);
const store = mainStore()
const { content } = storeToRefs(store);
onMounted(() => {
    var _uid = content.value.body.findIndex((v, i) => v.uid == props.content.uid);
    if (!content.value.body[_uid].update) {
        showEdit.value = true;
    }
    console.log("onMounted")
})
onUpdated(() => {
    console.log("onUpdated")
})
onUnmounted(() => {
    console.log("destroyed")
})
</script>
<template>
    <div>
        <g-modify :uid="props.content.uid" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">背景圖</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-img__box">
                    <div class="edit-img__title">*圖片網址:</div>
                    <input type="text" class="edit-img__input" />
                    <div class="edit-img__preview"></div>
                </div>
                <div class="edit-mobile__box">
                    <div class="edit-img__title">手機版圖片網址:</div>
                    <input type="text" class="edit-img__input" />
                    <div class="edit-img__preview"></div>
                </div>
                <div class="edit-link__box">
                    <div class="edit-link__title">主標連結:</div>
                    <input type="text" class="edit-link__input" />
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>