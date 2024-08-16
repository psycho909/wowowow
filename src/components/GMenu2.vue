<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import nestedDraggable from "./nested.vue";
import { GetPageType } from "../api";

const props = defineProps(["menu"])
const store = mainStore();
const { content, pageTypeSeq, group } = storeToRefs(store);
const menuToggle = ref(false);
const menuList = ref(props.menu);
const validPreviousComponents = ["GFixed", "GBg", "GSlogan", "GTop", "GWatermark", "GMusic", "GLang", "GArea"];
const bgStatus = computed(() => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == "GBg";
        })[0]
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

const total = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            const result = {};
            content.value.forEach(item => {
                const uid = item.uid;
                const subContent = item.content && item.content.subContent ? item.content.subContent : [];

                const componentCount = {};
                subContent.forEach(subItem => {
                    const component = subItem.component;
                    componentCount[component] = (componentCount[component] || 0) + 1;
                });

                if (Object.keys(componentCount).length > 0) {
                    result[uid] = componentCount;
                }
            });
            return result
        } else {
            return content.value.reduce((p, v, i) => {
                if (!p[v.component]) {
                    p[v.component] = 1
                } else {
                    p[v.component] += 1
                }
                return p
            }, {})
        }
    }
    return {}
})
const menuFilter1 = computed(() => {
    if (menuList) {
        if (pageTypeSeq.value == 1) {
            return props.menu.filter((item, i) => item.type.includes(1)).map((v, i) => {
                if (total.value[v.title] == v.limit) {
                    v.status = false
                } else {
                    v.status = true
                }
                return v;
            }).filter((v, i) => validPreviousComponents.includes(v.title)).sort((a, b) => {
                return a.order - b.order
            })
        }
        if (pageTypeSeq.value == 2) {
            return props.menu.filter((item, i) => item.type.includes(2)).filter((v, i) => v.title == "GArea" || v.title == "GFixed" || v.title == "GWatermark" || v.title == "GMusic" || v.title == "GLang" || v.title == "GTop").sort((a, b) => {
                return a.order - b.order
            })
        }

    }
})

const menuFilter2 = computed(() => {
    if (menuList) {
        if (pageTypeSeq.value == 1) {
            const filteredMenu = props.menu.filter((item, i) => item.type.includes(1)).map((v, i) => {
                if (total.value[v.title] == v.limit) {
                    v.status = false;
                } else {
                    v.status = true;
                }
                return v;
            }).filter(v => !validPreviousComponents.includes(v.title)).sort((a, b) => {
                return a.order - b.order;
            });
            const groupedMenu = [];
            let currentGroup = null;

            for (const element of filteredMenu) {
                if (element.title.startsWith("GSlide")) {
                    if (!currentGroup || currentGroup.title !== "輪播區塊") {
                        currentGroup = { title: "輪播區塊", elements: [] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else if (element.title.startsWith("GImg")) {
                    if (!currentGroup || currentGroup.title !== "圖片區塊") {
                        currentGroup = { title: "圖片區塊", elements: [] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else {
                    groupedMenu.push(element);
                }
            }
            return groupedMenu;
        }
        if (pageTypeSeq.value == 2) {
            if (group.value.name == 1) {
                const homeComponent = ["GLogo", "GIcon", "GBg", "GDNNav", "GDNImg"]
                let menu = props.menu
                return menu.filter((v, i) => homeComponent.includes(v.title)).sort((a, b) => {
                    return a.order - b.order
                }).map((v, i) => {
                    v.group = group.value.name;
                    v.drag = false;
                    return v
                })
            } else {
                const homeComponent = ["GBg", "GSlogan", "GVideo", "GText", "GSlide", "GImg", "GListText", "GAccordion", "GButtons", "GImgText", "GSlideText", "GTabs"]
                if (group.value.name == 'main') {
                    return;
                }
                const groupedMenu = [];
                let currentGroup = null;

                const filteredMenu = props.menu.filter((v, i) => homeComponent.includes(v.title)).sort((a, b) => {
                    return a.order - b.order
                }).map((v, i) => {
                    v.group = group.value.name;
                    return v
                })
                for (const element of filteredMenu) {
                    if (element.title.startsWith("GSlide")) {
                        if (!currentGroup || currentGroup.title !== "輪播區塊") {
                            currentGroup = { title: "輪播區塊", elements: [] };
                            groupedMenu.push(currentGroup);
                        }
                        currentGroup.elements.push(element);
                    } else if (element.title.startsWith("GImg")) {
                        if (!currentGroup || currentGroup.title !== "圖片區塊") {
                            currentGroup = { title: "圖片區塊", elements: [] };
                            groupedMenu.push(currentGroup);
                        }
                        currentGroup.elements.push(element);
                    } else {
                        groupedMenu.push(element);
                    }
                }
                return groupedMenu;
            }
        }
    }
});
const add = (cpt) => {
    if (cpt.title == "GBg") {
        if (bgStatus.value?.content?.pc) {
            bgStatus.value.update = true;
            return;
        } else {
            bgStatus.value.update = true;
            return;
        }
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

            <div class="g-menu__wrap">
                <a href="javascript:;" class="g-menu__add"
                   :class="[m.title == 'GBg' ? bgStatus?.content?.pc ? 'disabled' : '' : m.status ? '' : 'disabled']"
                   v-for="m in menuFilter1"
                   @click="add(m)">{{ m.label }}</a>
                <nested-draggable :tasks="menuFilter2" v-if="menuFilter2" />
            </div>
        </div>
    </Teleport>
</template>