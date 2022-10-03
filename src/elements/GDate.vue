<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(["date"])
const emit = defineEmits(["update:modelValue"])


// let date = ref(new Date())
let time = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
});

const handleDate = (modelData) => {
    emit("update:modelValue", modelData)
}
</script>
<template>
    <Datepicker v-model="date" :enableTimePicker="false"
                :previewFormat="null"
                selectText="確認" cancelText="取消"
                autoApply @update:modelValue="handleDate"></Datepicker>
</template>