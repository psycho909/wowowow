<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(["time"])
const emit = defineEmits(["update:modelValue"])

const handleTime = (modelTime) => {
    emit("update:modelValue", modelTime)
}
</script>
<template>
    <Datepicker v-model="time" @update:modelValue="handleTime" :previewFormat="null" selectText="確認" cancelText="取消"
                timePicker />
</template>