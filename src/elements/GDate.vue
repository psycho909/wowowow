<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(["date"])
const emit = defineEmits(["update:date"])

const date = ref(props.date);

const handleDate = (newDate) => {
    date.value = newDate;
    emit('update:date', date.value);
}
</script>
<template>
    <Datepicker :modelValue="date" :enableTimePicker="false"
                :previewFormat="null"
                selectText="確認" cancelText="取消"
                autoApply @update:modelValue="handleDate"></Datepicker>
</template>