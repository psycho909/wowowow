<script setup>
const props = defineProps(["label", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}

</script>
<template>
    <label class="checkbox-group">
        <span class="checkbox-group__label">{{label}}</span>
        <input type="checkbox" class="checkbox-group__control" :value="modelValue" v-model="modelValue"
               @change="updateValue">
        <span class="checkbox-group__style"></span>
    </label>
</template>