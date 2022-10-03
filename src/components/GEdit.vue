<script>
export default {
    name: "g-edit",
    label: ""
}
</script>
<script setup>
const props = defineProps({
    showEdit: {
        type: Boolean, default: false
    }
})
const emit = defineEmits(["update:showEdit"])
const closeBtn = () => {
    emit("update:showEdit", false)
}
onMounted(() => {

})
onUpdated(() => {

})
onUnmounted(() => {

})
</script>
<template>
    <div class="edit" v-if="showEdit">
        <div class="edit-module"></div>
        <div class="edit-wrap">
            <button type="button" class="edit-close" @click="closeBtn">close</button>
            <div class="edit-content">
                <slot name="edit-content"></slot>
            </div>
        </div>
    </div>
</template>