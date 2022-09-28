<script setup>
const props = defineProps(["text", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="edit-radio__label">
        <input type="radio" class="edit-radio__input" :value="props.modelValue" @change="updateValue">
        <span class="edit-radio__style"></span>
        <span class="edit-radio__text">{{props.text}}</span>
    </div>
</template>