<script setup>
import { onMounted, onUpdated } from "vue";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";

let openCheckSubmit = ref(false)
let openSubmitEvent = ref(false)

let eventName = ref("")
let gameType = ref("")
let gameStatus = ref("")
onMounted(async () => {
    await nextTick()
})


onUpdated(() => {
    console.log(123)

})

let startDate = ref(new Date())
let endDate = ref(new Date())
let startTime = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
});

let options1 = [{ value: 1, text: "11" }, { value: 2, text: "22" }]
let options2 = [{ value: 1, text: "33" }, { value: 2, text: "44" }]
const search = () => {
    console.log(startDate.value)
    console.log(endDate.value)
    console.log(startTime.value)
}
</script>
<template>
    <div class="event-list__filter">
        <div class="event-list__filter-name-box">
            <g-input label="活動名稱" placeholder="輸入內容" v-model="eventName" />
        </div>
        <div class="event-list__filter-date-box">
            <div class="date-group">
                <div class="date-group__label">日期區間</div>
                <g-date v-model="startDate" />
                <span>~</span>
                <g-date v-model="endDate" />
            </div>
        </div>
        <div class="event-list__filter-game-box">
            <g-select label="遊戲類別" v-model="gameType" :options="options1" />
            <g-select label="狀態" v-model="gameStatus" :options="options2" />
        </div>
        <div class="event-list__filter-btn-box">
            <a href="javascript:;" @click="search">搜尋</a>
        </div>
    </div>
    <div class="event-list__content">
        <div class="event-list__sort-box">
            <a href="javascript:;" class="event-list__list-sort__game">遊戲名稱</a>
            <a href="javascript:;" class="event-list__list-sort__date">活動區間</a>
            <a href="javascript:;" class="event-list__list-sort__event">活動名稱</a>
            <a href="javascript:;" class="event-list__list-sort__create">人員名稱</a>
            <a href="javascript:;" class="event-list__list-sort__status">狀態</a>
        </div>
        <div class="event-list__list-group">
            <div class="event-list__list-box">
                <div class="event-list__list-game">遊戲名稱</div>
                <div class="event-list__list-date">20220112-20220801</div>
                <a href="javascript:;" class="event-list__list-event">活動名稱活動名稱活動名稱活動名稱活動名稱</a>
                <div class="event-list__list-create">創建活動人員名稱</div>
                <div class="event-list__list-status">
                    <div>審核中</div>
                    <div>審核通過</div>
                    <div>編輯中</div>
                    <div>編輯|預覽|送審</div>
                    <div>瀏覽|審核</div>
                    <div>瀏覽|待審核</div>
                </div>
            </div>
        </div>
    </div>
    <div class="event-list__pagination">
        <a href="javascript:;" class="event-list__prev">上一頁</a>
        <span>1</span>/
        <span>5</span>
        <a href="javascript:;" class="event-list__next">下一頁</a>
    </div>
    <g-lightbox v-model:showLightbox="openCheckSubmit">
        <template #edit-title>
            <div>是否確定送審活動</div>
        </template>
        <template #edit-content>
            <div>活動名稱</div>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="openSubmitEvent">
        <template #edit-title>
            <div>審核活動</div>
        </template>
        <template #edit-content>
            <div>活動名稱</div>
        </template>
    </g-lightbox>
</template>