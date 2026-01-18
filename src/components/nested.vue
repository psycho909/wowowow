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
import { GetPageType } from "../api";

const store = mainStore();
const { content, pageTypeSeq, group, targetArea } = storeToRefs(store);
let toggle = ref(false);
const FILTERED_TITLES = ["GFixed", "GBg", "GSlogan", "GTop", "GWatermark", "GMusic", "GLang"];

const bgStatus = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GBg";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GBg";
            })[0]
        }
    }
    return {}
})
const componentStatus = (cpt) => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == cpt;
        })[0]
    }
    return {}
}
const logoStatus = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GLogo";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GLogo";
            })[0]
        }
    }
    return {}
})
const iconStatus = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GIcon";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GIcon";
            })[0]
        }
    }
    return {}
})
const navStatus = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GDNNav";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GDNNav";
            })[0]
        }
    }
    return {}
})
const imgStatus = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GDNImg";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GDNImg";
            })[0]
        }
    }
    return {}
})

const sloganStatus = computed(() => {

    if (content.value) {
        if (pageTypeSeq.value == 2) {
            let currentArea = content.value.filter((c, i) => {
                return c.uid == targetArea.value
            })[0]
            return currentArea.content.subContent.filter((c, i) => {
                return c.component == "GSlogan";
            })[0]
        } else {
            return content.value.filter((c, i) => {
                return c.component == "GSlogan";
            })[0]
        }
    }
    return {}
})
const add = (cpt) => {
    if (cpt.title == "圖片區塊" || cpt.title == "輪播區塊") {
        return;
    }
    GetPageType(store.otp)
    let data = {
        cpt: cpt.title
    };
    if (cpt.title == "GBg") {
        if (bgStatus.value?.content?.init) {
            return;
        } else {
            bgStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GLogo") {
        if (logoStatus.value) {
            logoStatus.value.update = true;
        } else {
            store.addCpt(data);
        }

        return;
    }
    if (cpt.title == "GIcon") {
        if (iconStatus.value) {
            iconStatus.value.update = true;
        }
        else {
            store.addCpt(data);
        }
        return;
    }
    if (cpt.title == "GDNNav") {
        if (navStatus.value) {
            navStatus.value.update = true;
        } else {
            store.addCpt(data);
        }
        return;
    }
    if (cpt.title == "GDNImg" && group.value.name == 1) {
        if (imgStatus.value) {
            imgStatus.value.update = true;
        } else {
            store.addCpt(data);
        }
        return;
    }
    if (cpt.title == "GSlogan") {
        if (componentStatus("GSlogan")) {
            componentStatus("GSlogan").update = true;
            return;
        }

    }
    if (cpt.title == "GFixed") {
        if (componentStatus("GFixed")) {
            componentStatus("GFixed").update = true;
            return;
        }
    }
    if (cpt.title == "GWatermark") {
        if (componentStatus("GWatermark")) {
            componentStatus("GWatermark").update = true;
            return;
        }
    }
    if (cpt.title == "GTop") {
        if (componentStatus("GTop")) {
            componentStatus("GTop").update = true;
            return;
        }
    }
    if (cpt.title == "GMusic") {
        if (componentStatus("GMusic")) {
            componentStatus("GMusic").update = true;
            return;
        }
    }
    if (cpt.title == "GLang") {
        if (componentStatus("GLang")) {
            componentStatus("GLang").update = true;
            return;
        }
    }
    if (!cpt.status) {
        return;
    }

    store.addCpt(data);
    store.setUpdateTime();
    if (store.first) {
        store.setFirst(false);
    }
}
const log = (evt) => {
    // console.log("evt", evt);
}
const moveLog = (e) => {
    // console.log("menu move", e)
}
const start = (e) => {
    // console.log("menu start", e)
}
const end = (e) => {
    // console.log(e)
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
            <div class="g-menu__add"
                 :class='[FILTERED_TITLES.includes(element.title) ? "filtered" : "", element.status ? "" : "disabled"]'
                 :data-title="[element?.elements ? 'true' : 'false']"
                 :data-limit="element.limit"
                 :data-order="element.order"
                 :data-drag='[FILTERED_TITLES.includes(element.title) || element.drag == false ? "false" : "true"]'>
                <template v-if="element.label">
                    <div @click="add(element)">{{ element.label }}</div>
                </template>
                <template v-if="element?.elements">
                    <span class="g-menu__title filtered" @click="toggleMenu" data-toggle="false"
                          data-draggable="false">{{ element.title }}</span>
                    <nested-draggable :tasks="element.elements" />
                </template>
            </div>
        </template>
    </draggable>
</template>