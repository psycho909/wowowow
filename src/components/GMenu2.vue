<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";

const props = defineProps(["menu"])
const store = mainStore();
const { content } = storeToRefs(store);
const menuToggle = ref(false);

const bgStatus = computed(() => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == "GBg";
        })[0]
    }
    return {}
})
const total = computed(() => {
    if (content.value) {
        return content.value.reduce((p, v, i) => {
            if (!p[v.component]) {
                p[v.component] = 1
            } else {
                p[v.component] += 1
            }
            return p
        }, {})
    }
    return {}
})

const menuFilter = computed(() => {
    if (props.menu) {
        return props.menu.map((v, i) => {
            if (total.value[v.title] == v.limit) {
                v.status = false
            } else {
                v.status = true
            }
            return v;
        }).sort((a, b) => {
            return a.order - b.order
        })
    }
})
const add = (cpt) => {
    if (cpt.title == "GBg") {
        if (bgStatus.value?.content?.pc) {
            return;
        } else {
            bgStatus.value.update = true;
            return;
        }
    }
    if (!cpt.status) {
        return;
    }
    let data = {
        cpt: cpt.title
    };
    store.addCpt(data);
    store.setUpdateTime();
    if (store.first) {
        store.setFirst(false);
    }
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
            <a href="javascript:;" class="g-menu__add"
               :class="[m.title == 'GBg' ? bgStatus?.content?.pc ? 'disabled' : '' : m.status ? '' : 'disabled']"
               v-for="m in menuFilter"
               @click="add(m)">{{ m.label }}</a>
        </div>
    </Teleport>
</template>