<script setup>

</script>
<template>
    <div class="event-list__filter">
        <div class="event-list__filter-name-box"></div>
        <div class="event-list__filter-date-box"></div>
        <div class="event-list__filter-game-box"></div>
        <div class="event-list__filter-status-box"></div>
        <div class="event-list__filter-btn-box"></div>
    </div>
    <div class="event-list__content">
        <div class="event-list__sort-box">
            <a href="javascript:;" class="event-list__list-sort__game">遊戲名稱</a>
            <a href="javascript:;" class="event-list__list-sort__date">活動區間</a>
            <a href="javascript:;" class="event-list__list-sort__event">活動名稱</a>
            <a href="javascript:;" class="event-list__list-sort__create">人員名稱</a>
            <a href="javascript:;" class="event-list__list-sort__status">狀態</a>
        </div>
        <div class="event-list__list-group">
            <div class="event-list__list-box">
                <div class="event-list__list-game">遊戲名稱</div>
                <div class="event-list__list-date">20220112-20220801</div>
                <a href="javascript:;" class="event-list__list-event">活動名稱活動名稱活動名稱活動名稱活動名稱</a>
                <div class="event-list__list-create">創建活動人員名稱</div>
                <div class="event-list__list-status">
                    <div>審核中</div>
                    <div>審核通過</div>
                    <div>編輯中</div>
                    <div>編輯|預覽|送審</div>
                    <div>瀏覽|審核</div>
                    <div>瀏覽|待審核</div>
                </div>
            </div>
        </div>
    </div>
    <div class="event-list__pagination">
        <a href="javascript:;" class="event-list__prev">上一頁</a>
        <span>1</span>/
        <span>5</span>
        <a href="javascript:;" class="event-list__next">下一頁</a>
    </div>
</template>