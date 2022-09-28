<script setup>
const props = defineProps(["text", "placeholder", "preview", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="edit-text__label">
        <input type="text" class="edit-text__input" :value="props.modelValue" @input="updateValue"
               :placeholder="props.placeholder">
        <div v-if="props.preview"><img :src="props.preview" alt="預覽圖"></div>
    </div>
</template>