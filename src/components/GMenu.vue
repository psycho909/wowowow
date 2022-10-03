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
    <Teleport to="body">
        <div class="g-menu open">
            <a href="javascript:;" class="g-menu__open icon-open"></a>
            <a href="javascript:;" class="g-menu__close icon-close"></a>
            <a href="javascript:;" class="g-menu__add" v-for="m in props.menu" @click="add(m.title)">{{m.label}}</a>
        </div>
    </Teleport>
</template>