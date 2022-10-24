<script setup>
// const props = defineProps(["label", "options", "group", "modelValue", "valid"])
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    options: {
        type: Array,
        default: ""
    },
    modelValue: {
        type: String,
        default: ""
    },
    group: {
        type: Boolean,
        default: false
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
    <div class="select-group" :class="[valid?'':'warning']">
        <div class="select-group__label">{{label}}</div>
        <div class="select-group__box" v-if="group">
            <select class="select-group__control" @change="updateValue" v-model="modelValue">
                <optgroup label="淺色系">
                    <option :value="option.value" v-for="option in options[0]">{{option.text}}</option>
                </optgroup>
                <optgroup label="深色系">
                    <option :value="option.value" v-for="option in options[1]">{{option.text}}</option>
                </optgroup>
            </select>
            <div class="select-group__warning" v-if="!valid">請填寫正確 {{label}}</div>
        </div>
        <div class="select-group__box" v-else>
            <select class="select-group__control" @change="updateValue" v-model="modelValue">
                <option value="-1">請選擇</option>
                <option :value="option.value" v-for="option in options">{{option.text}}</option>
            </select>
            <div class="select-group__warning" v-if="!valid">請填寫正確 {{label}}</div>
        </div>
    </div>
</template>