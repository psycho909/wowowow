<script>
export default {
    name: "Foo"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import Control from "./Control.vue";
const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
let showEdit = ref(false);
let text = ref("");

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
    console.log("destroyed", "Foo")
})
const handleText = () => {
    showEdit.value = true;
}
const handleUpdate = () => {
    store.setText(text.value)
}
const handleSubmit = () => {
    var data = {
        uid: props.content.uid,
        content: {
            text: text.value
        }
    };
    store.upCpt(data);
    showEdit.value = false;
}
</script>
<template>
    <div class="box foo">
        <div>{{props.content.text}}</div>
        <button type="button" class="btn" @click="test">測試</button>
        <Control :uid="content.uid">
            <template #btn-update>
                <button type="button" class="update" @click="update">update</button>
            </template>
        </Control>
    </div>
</template>