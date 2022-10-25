<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["menu"])
const store = mainStore()
const { content } = storeToRefs(store);
const menuToggle = ref(false)

const total = computed(() => {
    if (content.value.body) {
        return content.value.body.reduce((p, v, i) => {
            if (!p[v.component]) {
                p[v.component] = 1
            } else {
                p[v.component] += 1
            }
            return p
        }, {})
    }
})

const menuFilter = computed(() => {
    if (props.menu && total.value) {
        return props.menu.map((v, i) => {
            if (total.value[v.title] == v.limit) {
                v.status = false
            } else {
                v.status = true
            }
            return v;
        })
    }
})

const add = (cpt) => {
    if (!cpt.status) {
        return;
    }
    let data = {
        cpt: cpt.title
    };
    store.addCpt(data);
}

const onOpen = () => {
    menuToggle.value = true
}
const onClose = () => {
    menuToggle.value = false
}
</script>
<template>
    <Teleport to="body">
        <div class="g-menu" :class="[menuToggle ? 'open' : '']">
            <a href="javascript:;" class="g-menu__open icon-open" @click="onOpen"></a>
            <a href="javascript:;" class="g-menu__close icon-close" @click="onClose"></a>
            <a href="javascript:;" class="g-menu__add" :class="[m.status ? '' : 'disabled']" v-for="m in menuFilter"
               @click="add(m)">{{ m.label }}</a>
        </div>
    </Teleport>
</template>