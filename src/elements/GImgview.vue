<script setup>
const props = defineProps(["label", "placeholder", "preview", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="input-group">
        <div class="input-group__text">{{label}}</div>
        <input type="text" class="input-group__control" :value="modelValue" @input="updateValue"
               :placeholder="placeholder">
        <div class="input-group__img"><img :src="preview" alt="預覽圖"></div>
    </div>
</template>