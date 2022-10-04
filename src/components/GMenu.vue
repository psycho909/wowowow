<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["menu"])
const store = mainStore()
const { content } = storeToRefs(store);
const menuToggle = ref(false)
const bg = computed(() => {
    return content.value.body.filter((c, i) => {
        return c.component == "GBg"
    })
})
const slogan = computed(() => {
    return content.value.body.filter((c, i) => {
        return c.component == "GSlogan"
    })
})
const fixed = computed(() => {
    return content.value.body.filter((c, i) => {
        return c.component == "GFixed"
    })
})
const menuFilter = computed(() => {
    return props.menu.map((v, i) => {
        if (bg.value.length > 0 && v.title == "GBg") {
            v.status = false
        }
        if (slogan.value.length > 0 && v.title == "GSlogan") {
            v.status = false
        }
        if (fixed.value.length > 0 && v.title == "GFixed") {
            v.status = false
        }
        return v;
    })
})

const add = (cpt) => {
    if (!cpt.status) {
        return;
    }
    var data = {
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
        <div class="g-menu" :class="[menuToggle?'open':'']">
            <a href="javascript:;" class="g-menu__open icon-open" @click="onOpen"></a>
            <a href="javascript:;" class="g-menu__close icon-close" @click="onClose"></a>
            <a href="javascript:;" class="g-menu__add" :class="[m.status?'':'disabled']" v-for="m in menuFilter"
               @click="add(m)">{{m.label}}</a>
        </div>
    </Teleport>
</template>