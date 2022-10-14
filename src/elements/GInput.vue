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
    preview: {
        type: String,
        default: ""
    },
    color: {
        type: String,
        default: ""
    }
})


const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="input-group">
        <div class="input-group__label" v-if="label">*{{label}}:</div>
        <input type="text" class="input-group__control" :value="modelValue" @input="updateValue"
               :placeholder="placeholder">
        <div class="input-group__img" v-if="preview"><img :src="preview" alt="預覽圖"></div>
        <div class="input-group__color" v-if="color"><span :style="`--color:${color}`"></span></div>

    </div>
</template>