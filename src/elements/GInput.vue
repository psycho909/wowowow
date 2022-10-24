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
    },
    valid: {
        type: Boolean,
        default: true
    }
})


const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="input-group" :class="[valid?'':'warning']">
        <div class="input-group__label" v-if="label">{{label}}</div>
        <div class="input-group__box">
            <input type="text" class="input-group__control" :value="modelValue" @input="updateValue"
                   :placeholder="placeholder" v-show="!color">
            <div class="input-group__warning" v-if="!valid">請填寫正確 {{label || placeholder}}</div>
        </div>
        <div class="input-group__img" v-if="preview"><img :src="preview" alt="預覽圖"></div>
        <div class="input-group__color" v-if="color"><span :style="`--color:${color}`"></span></div>
    </div>
</template>