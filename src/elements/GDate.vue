<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

const props = defineProps(["date"])
const emit = defineEmits(["update:date"])

let time = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
});

const handleDate = (modelData) => {
    emit("update:date", modelData)
}
</script>

<template>
    <Datepicker
                :model-value="date"
                @update:model-value="handleDate"
                :enableTimePicker="false"
                :previewFormat="null"
                selectText="確認"
                cancelText="取消"
                autoApply></Datepicker>
</template>