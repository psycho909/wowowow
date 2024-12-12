<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import nestedDraggable from "./nested.vue";

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
            const topComponent = ["GLang", "GWatermark", "GMusic", "GTop", "GFixed"];
            const result = {};
            content.value.forEach(item => {
                const uid = item.uid;
                const subContent = item.content && item.content.subContent ? item.content.subContent : [];

                const componentCount = {};
                const onlyComponent={}
                subContent.forEach(subItem => {
                    const component = subItem.component;
                    componentCount[component] = (componentCount[component] || 0) + 1;
                });
                if(topComponent.includes(item.component)){
                    const component = item.component;
                    onlyComponent[component] = (onlyComponent[component] || 0) + 1;
                    result[uid] = onlyComponent;
                }
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
const menuFilter = computed(() => {
    if (!menuList) return [];

    if (pageTypeSeq.value === 1) {
        const filteredMenu = props.menu
            .filter(item => item.type.includes(1))
            .map(v => ({
                ...v,
                status: total.value[v.title] !== v.limit
            }))

        const validPreviousMenu = filteredMenu.filter(v => validPreviousComponents.includes(v.title));

        const remainingMenu = filteredMenu.filter(v => !validPreviousComponents.includes(v.title));
        const groupedMenu = [];
        let currentGroup = null;

        for (const element of remainingMenu) {
            if (element.title.startsWith("GSlide")) {
                if (!currentGroup || currentGroup.title !== "輪播區塊") {
                    currentGroup = { title: "輪播區塊", elements: [], order: [4, 9] };
                    groupedMenu.push(currentGroup);
                }
                currentGroup.elements.push(element);
            } else if (element.title.startsWith("GImg")) {
                if (!currentGroup || currentGroup.title !== "圖片區塊") {
                    currentGroup = { title: "圖片區塊", elements: [], order: [5, 10] };
                    groupedMenu.push(currentGroup);
                }
                currentGroup.elements.push(element);
            } else {
                groupedMenu.push(element);
            }
        }
        return [...validPreviousMenu, ...groupedMenu]
            .sort((a, b) => {
                return a.order[0] - b.order[0]
            });
    }

    if (pageTypeSeq.value == 2) {
        // First condition: Filter and sort specific menu items
        const specificItems = props.menu
            .filter(item => item.type.includes(2))
            .filter(v => ["GArea", "GFixed", "GWatermark", "GMusic", "GLang", "GTop"].includes(v.title)).map(v => {
                return {
                    ...v,
                    drag: false,
                }
            })
        // Second condition: Based on group value
        if (group.value.name == 1) {
            const homeComponent = ["GLogo", "GIcon", "GBg", "GDNNav", "GDNImg"];
            let filteredMenu = props.menu
                .filter(v => homeComponent.includes(v.title))

            let temp=[...specificItems, ...filteredMenu];
            // temp.forEach(item => {
            //     for (let key in total.value) {
            //         console.log(total.value[key])
            //         if (total.value[key][item.title] !== undefined) {
            //             // console.log(item)
            //             if (total.value[key][item.title] === item.limit) {
            //                 item.status = false;
            //             }
            //         }else{
            //             // console.log(item)
            //             item.status = true;
            //         }
            //     }
            // });
            // 建立快速查詢結構
            let titleLimitMap = {};
            for (let key in total.value) {
                Object.assign(titleLimitMap, total.value[key]);
            }

            // 更新 temp 的 status
            temp.forEach(item => {
                if (titleLimitMap[item.title] !== undefined && titleLimitMap[item.title] === item.limit) {
                    item.status = false;
                }else{
                    item.status = true;
                }
            });
            return temp
                .sort((a, b) => a.order[1] - b.order[1])
                .map(v => ({
                    ...v,
                    group: group.value.name,
                    drag: false
                }));
        } else {
            const homeComponent = ["GBg", "GSlogan", "GVideo", "GText", "GSlide", "GImg", "GListText", "GAccordion", "GButtons", "GImgText", "GSlideText", "GTabs"];

            if (group.value.name == 'main') {
                return;
            }

            const filteredMenu = props.menu
                .filter(v => homeComponent.includes(v.title))
                .map(v => ({
                    ...v,
                    group: group.value.name
                }));

            const groupedMenu = [];
            let currentGroup = null;

            for (const element of filteredMenu) {
                if (element.title.startsWith("GSlide")) {
                    if (!currentGroup || currentGroup.title !== "輪播區塊") {
                        currentGroup = { title: "輪播區塊", elements: [], order: [4, 9] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else if (element.title.startsWith("GImg")) {
                    if (!currentGroup || currentGroup.title !== "圖片區塊") {
                        currentGroup = { title: "圖片區塊", elements: [], order: [5, 10] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else {
                    groupedMenu.push(element);
                }
            }
            let temp=[...specificItems, ...groupedMenu];
            // temp.forEach(item => {
            //     for (let key in total.value) {
            //         if (total.value[key][item.title] !== undefined) {
            //             if (total.value[key][item.title] === item.limit) {
            //                 item.status = false;
            //             }
            //         }
            //     }
            // });
            let titleLimitMap = {};
            for (let key in total.value) {
                Object.assign(titleLimitMap, total.value[key]);
            }

            // 更新 temp 的 status
            temp.forEach(item => {
                if (titleLimitMap[item.title] !== undefined && titleLimitMap[item.title] === item.limit) {
                    item.status = false;
                }else{
                    item.status = true;
                }
            });
            return temp
                .sort((a, b) => {
                    return a.order[1] - b.order[1]
                });
        }
    }
    return [];
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
                <nested-draggable :tasks="menuFilter" v-if="menuFilter" />
            </div>
        </div>
    </Teleport>
</template>