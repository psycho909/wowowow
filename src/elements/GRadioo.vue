<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ""
    }, name: {
        type: String,
        default: ""
    }, value: {
        type: [String, Number, Boolean],
        default: ""
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: ""
    },
    align: {
        type: String,
        default: "right"
    },
    disable: {
        type: [String, Boolean],
        default: false
    },
})
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
    emit("update:modelValue", event.target.value)
}

</script>
<template>
    <label class="radio-group">
        <span class="radio-group__label" v-if="align == 'left'">{{ label }}</span>
        <input type="radio" class="radio-group__control" :name="name" :value="value" v-model="radioValue"
               @change="updateValue" :disabled="disable">
        <span class="radio-group__style"></span>
        <span class="radio-group__label" v-if="align == 'right'">{{ label }}</span>
    </label>
</template>