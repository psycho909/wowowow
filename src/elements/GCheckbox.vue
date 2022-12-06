<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: ""
    },
    trueValue: {
        default: true
    },
    falseValue: {
        default: false
    }
})
const emit = defineEmits(["update:modelValue"])
const checkboxValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}

</script>
<template>
    <label class="checkbox-group">
        <span class="checkbox-group__label">{{ label }}</span>
        <input type="checkbox" class="checkbox-group__control" :value="modelValue" v-model="checkboxValue"
               :true-value="trueValue" :false-value="falseValue"
               @change="updateValue">
        <span class="checkbox-group__style"></span>
    </label>
</template>