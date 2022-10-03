<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);

let types = ref([
    { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }
])

const selectType = (type) => {
    store.$patch(state => {
        state.type = type
        state.page = "CreateEvent"
    })
}

const prev = () => {

}
const next = () => {

}
</script>
<template>
    <div class="container">
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>選擇樣板</span>
        </div>
        <div class="select-type__content">
            <div class="select-type__box" v-for="t in types" @click="selectType(t.type)">
                <a href="javascript:;" class="select-type__type"></a>
                <div class="select-type__name">{{t.name}}</div>
            </div>
        </div>
        <div class="page-pagination__box">
            <a href="javascript:;" class="btn btn__prev">上一頁</a>
            <div class="page-pagination__number">
                <span class="page-pagination__current">1</span>/
                <span>5</span>
            </div>
            <a href="javascript:;" class="btn btn__next">下一頁</a>
        </div>
    </div>
</template>