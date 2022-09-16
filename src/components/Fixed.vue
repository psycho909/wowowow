<script>
export default {
    name: "Fixed",
    label: "浮動式選單"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";

const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
let showEdit = ref(false);
const position = computed(() => {
    var top = props.content.top ? `top:0px;` : `bottom:0px;`;
    var left = props.content.left ? `left:0px;` : `right:0px;`;
    return top + left;
})
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
const oneItem = {
    key: 'title',
    title: '小说名',
    component: 'el-input',
    props: { placeholder: '请输入姓名' },
    rule: [{ required: true, trigger: 'blur', message: '必填项' }],
}
</script>
<template>
    <div class="box fixed" :style="position" :data-uid="content.uid">
        <div>fixed {{content.uid}} </div>
        <Control :uid="content.uid" />
        <Edit v-model:showEdit="showEdit">
            <template #edit-content>
                <input type="text" v-model="text" />
                <button type="button" class="submit" @click="submit">確定</button>
            </template>
        </Edit>
    </div>
</template>