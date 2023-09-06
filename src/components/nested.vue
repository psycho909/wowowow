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
const { content, pageTypeSeq, group, targetArea } = storeToRefs(store);
let toggle = ref(false);

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
    if (cpt.title == "GBg") {
        if (bgStatus.value?.content?.init) {
            return;
        } else {
            bgStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GLogo") {
        if (logoStatus.value?.content?.init) {
            return;
        } else {
            logoStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GIcon") {
        if (iconStatus.value?.content?.init) {
            return;
        } else {
            iconStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GDNNav") {
        if (navStatus.value?.content?.init) {
            return;
        } else {
            navStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GDNImg" && group.value.name == 1) {
        if (imgStatus.value?.content?.init) {
            return;
        } else {
            imgStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GSlogan") {
        if (sloganStatus.value?.content?.init) {
            return;
        } else {
            if (sloganStatus.value) {
                sloganStatus.value.update = true;
                return;
            }

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
            <div @click="add(element)"
                 class="g-menu__add"
                 :class="[element.title == 'GBg' || element.title == 'GSlogan' ? 'filtered' : '', element.status ? '' : 'disabled']"
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