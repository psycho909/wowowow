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
</script>
<template>
    <Teleport to="body">
        <div class="g-edit" v-if="showEdit">
            <div class="g-edit__module"></div>
            <div class="g-edit__wrap">
                <a href="javascript:;" class="icon icon-close" @click="closeBtn">close</a>
                <div class="g-edit__content">
                    <slot name="edit-content"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>