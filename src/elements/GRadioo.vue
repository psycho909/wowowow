<script setup>
const props = defineProps(["label", "name", "value", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}

</script>
<template>
    <label class="radio-group">
        <input type="radio" class="radio-group__control" :name="name" :value="value" v-model="modelValue"
               @change="updateValue">
        <span class="radio-group__style"></span>
        <span class="radio-group__label">{{label}}</span>
    </label>
</template>