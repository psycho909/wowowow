<script>
export default {
    name: "",
    label: ""
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content } = storeToRefs(store);
onMounted(() => {
    var _uid = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
    if (!content.value.body[_uid].update) {
        showEdit.value = true;
    }

})
onUpdated(() => {

})
onUnmounted(() => {

})
</script>
<template>
    <div>
        <Control :uid="props.data.uid" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動式選單</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <input type="text" v-model="text" />
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>