<script setup>

const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    placeholder: {
        type: String,
        default: ""
    },
    modelValue: {
        type: String,
        default: ""
    },
})


const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="input-group">
        <div class="input-group__label" v-if="label">{{label}}</div>
        <textarea class="input-group__control" id="" cols="30" rows="10" :value="modelValue" @input="updateValue"
                  :placeholder="placeholder"></textarea>
    </div>
</template>