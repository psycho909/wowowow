<script setup>
const props = defineProps(["label", "name", "value", "modelValue"])
const emit = defineEmits(["update:modelValue"])

const radioValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const updateValue = (event) => {
    emit("update:modelValue", radioValue.value)
}
</script>
<template>
    <label class="radio-group">
        <input type="radio" class="radio-group__control" :name="name" :value="value" v-model="radioValue"
               @change="updateValue">
        <span class="radio-group__style"></span>
        <span class="radio-group__label">{{ label }}</span>
    </label>
</template>