<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["menu"])
const store = mainStore()
const { content } = storeToRefs(store);

const add = (cpt) => {
    var data = {
        cpt
    };
    store.addCpt(data);
}
</script>
<template>
    <div>
        <button type="button" class="add" v-for="m in props.menu" @click="add(m)">Add {{m}}</button>
    </div>
</template>