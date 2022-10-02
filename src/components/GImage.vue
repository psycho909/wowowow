<script>
export default {
    name: "Image",
    label: "圖片區塊"
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
        <Control :uid="props.content.uid" />
        <Edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">圖片區塊</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-img_num__box">
                    <div class="edit-img_num__title">選擇圖片框樣式:</div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__style"></span>
                        <span class="edit-radio__text">單一圖片</span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__style"></span>
                        <span class="edit-radio__text">單一圖片</span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__style"></span>
                        <span class="edit-radio__text">兩格圖片</span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__style"></span>
                        <span class="edit-radio__text">三格圖片</span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__style"></span>
                        <span class="edit-radio__text">四格圖片</span>
                    </div>
                </div>
                <div>
                    <div class="edit-img_link__box">
                        <div class="edit-img_link__title">圖片網址1</div>
                        <input type="text" class="edit-img_link__input edit-style__input">
                        <div class="edit-img_link__preview"></div>
                    </div>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </Edit>
    </div>
</template>