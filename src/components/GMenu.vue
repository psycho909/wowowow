<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import draggable from "vuedraggable";

const props = defineProps(["menu"])
const store = mainStore();
const { content } = storeToRefs(store);
const menuToggle = ref(false);
const menuList = ref(props.menu);

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

const menuFilter1 = computed(() => {
    if (menuList) {
        return props.menu.map((v, i) => {
            if (total.value[v.title] == v.limit) {
                v.status = false
            } else {
                v.status = true
            }
            return v;
        }).filter((v, i) => v.title == "GBg" || v.title == "GSlogan" || v.title == "GFixed").sort((a, b) => {
            return a.order - b.order
        })
    }
})

const menuFilter2 = computed(() => {
    if (menuList) {
        return props.menu.map((v, i) => {
            if (total.value[v.title] == v.limit) {
                v.status = false
            } else {
                v.status = true
            }
            return v;
        }).filter((v, i) => v.title != "GBg" && v.title != "GSlogan" && v.title != "GFixed").sort((a, b) => {
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
const log = (evt) => {
    console.log("evt", evt);
}
const moveLog = (e) => {
    console.log("menu move", e)
}
const start = (e) => {
    console.log("menu start", e)
}
const end = (e) => {
    console.log(e)
}
</script>
<template>
    <Teleport to="body">
        <div class="g-menu" :class="[menuToggle ? 'open' : '']">
            <a href="javascript:;" class="g-menu__open icon-open" @click="onOpen"></a>
            <a href="javascript:;" class="g-menu__close icon-close" @click="onClose"></a>

            <div class="g-menu__wrap">
                <a href="javascript:;" class="g-menu__add"
                   :class="[m.title == 'GBg' ? bgStatus?.content?.pc ? 'disabled' : '' : m.status ? '' : 'disabled']"
                   v-for="m in menuFilter1"
                   @click="add(m)">{{ m.label }}</a>
                <draggable
                           class="list-group"
                           :list="menuFilter2"
                           :group="store.group"
                           :sort="false"
                           :force-fallback="true"
                           :fallback-tolerance="1"
                           :scroll-sensitivity="100"
                           @start="start"
                           @end="end"
                           @change="log"
                           @move="moveLog"
                           itemKey="label">
                    <template #item="{ element, index }">
                        <a href="javascript:;" class="g-menu__add"
                           :class="[element.title == 'GBg' ? bgStatus?.content?.pc ? 'disabled' : '' : element.status ? '' : 'disabled']"
                           @click="add(element)">{{ element.label }}</a>
                    </template>
                </draggable>
            </div>
        </div>
    </Teleport>
</template>