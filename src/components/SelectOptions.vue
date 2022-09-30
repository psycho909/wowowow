<script setup>
const props = defineProps(["label", "options", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="select-group">
        <div class="select-group__label">{{label}}</div>
        <select class="select-group__control" @change="updateValue">
            <option value="-1">請選擇</option>
            <option :value="option.value" v-for="option in options">{{option.text}}</option>
        </select>
    </div>
</template>