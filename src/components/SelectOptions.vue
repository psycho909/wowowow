<script setup>
const props = defineProps(["text", "options", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <select class="edit-select__select" @change="updateValue">
        <option value="-1">請選擇</option>
        <option :value="option.value" v-for="option in props.options">{{option.text}}</option>
    </select>
</template>