<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(["time"])
const emit = defineEmits(["update:time"])

const time = ref(props.time);

const handleTime = (modelTime) => {
    time.value = modelTime;
    emit("update:time", time.value)
}
</script>
<template>
    <Datepicker :modelValue="time" @update:modelValue="handleTime" :previewFormat="null" selectText="確認" cancelText="取消"
                timePicker />
</template>