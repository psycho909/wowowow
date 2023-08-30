<script>
import draggable from "vuedraggable";

export default {
    props: {
        tasks: {
            required: true,
            type: Array
        }
    },
    components: {
        draggable
    },
    name: "nested-draggable"
};
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore();
const { content } = storeToRefs(store);
let toggle = ref(false);

const bgStatus = computed(() => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == "GBg";
        })[0]
    }
    return {}
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

const toggleMenu = (e) => {
    let gMenuTitle = e.target;
    const currentValue = gMenuTitle.getAttribute('data-toggle');
    const newValue = currentValue === 'false' ? 'true' : 'false';
    gMenuTitle.setAttribute('data-toggle', newValue);
}
</script>
<template>
    <draggable
               class="list-group"
               filter=".filtered"
               :sort="false"
               :force-fallback="true"
               :fallback-tolerance="1"
               :scroll-sensitivity="100"
               :list="tasks"
               :group="store.group"
               @start="start"
               @end="end"
               @change="log"
               @move="moveLog"
               item-key="label">
        <template #item="{ element }">
            <div @click="add(element)"
                 class="g-menu__add"
                 :class="[element.title == 'GBg' ? bgStatus?.content?.pc ? 'disabled' : '' : element.status ? '' : 'disabled']"
                 :data-title="[element?.elements ? 'true' : 'false']">
                <template v-if="element.label">{{ element.label }}</template>
                <template v-if="element?.elements">
                    <span class="g-menu__title filtered" @click="toggleMenu" data-toggle="false" data-draggable="false">{{
                        element.title }}</span>
                    <nested-draggable :tasks="element.elements" />
                </template>
            </div>
        </template>
    </draggable>
</template>