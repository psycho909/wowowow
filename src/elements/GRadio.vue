<script setup>
const props = defineProps(["label", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="radio-group">
        <input type="radio" class="radio-group__control" :value="props.modelValue" @change="updateValue">
        <span class="radio-group__style"></span>
        <span class="radio-group__label">{{props.text}}</span>
    </div>
</template>