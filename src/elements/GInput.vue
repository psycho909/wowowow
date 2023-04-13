<script setup>

const props = defineProps({
    type: {
        type: String,
        default: "text"
    },
    label: {
        type: String,
        default: ""
    },
    placeholder: {
        type: [String, Number],
        default: ""
    },
    modelValue: {
        type: [String, Number],
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
    },
    required: {
        type: Boolean,
        default: false
    },
    max: {
        type: [Number, String],
        default: ""
    }
})


const emit = defineEmits(["update:modelValue"])

const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="input-group" :class="[valid ? '' : 'warning']">
        <div class="input-group__label" :class="[required ? 'required' : '']" v-if="label">{{ label }}</div>
        <div class="input-group__box">
            <input :type="type" class="input-group__control" :value="modelValue" @input="updateValue"
                   :placeholder="placeholder" v-show="!color" :maxlength="max">
            <div class="input-group__warning" v-if="!valid" :data-warning="`請填寫正確 ${label || placeholder}`"></div>
        </div>
        <div class="input-group__img" v-if="preview"><img :src="preview" alt="預覽圖"></div>
        <div class="input-group__color" v-if="color"><span :style="`--color:${color}`"></span></div>
    </div>
</template>