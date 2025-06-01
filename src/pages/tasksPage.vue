<template>
    <div class="tasks-section">
        <h2 class="tasks-title">🎯 {{ t('tasks.title') }}</h2>

        <div v-for="task in tasks" :key="task.id" class="task-card">
            <div class="task-content">
                <img :src="task.icon" class="task-icon" />
                <div class="task-text">
                    <h3 class="task-name">{{ t(`tasks.list.${task.id}.name`) }}</h3>
                    <p class="task-desc">{{ t(`tasks.list.${task.id}.description`) }}</p>
                </div>
            </div>
            <a :href="task.link" target="_blank" class="task-btn">{{ t('tasks.button') }}</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tasks = [
    {
        id: 1,
        link: 'https://t.me/TonlandiaCommunity',
        icon: '/img/channel.jpg',
    },
    {
        id: 2,
        link: 'https://t.me/TonlandiaChat',
        icon: '/img/pepafinal.png',
    },
]
</script>

<style scoped>
.tasks-section {
    padding: 20px;
    color: white;
    font-family: 'Rubik', sans-serif;
}

.tasks-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 18px;
    color: white;
    text-align: center;
}

.task-card {
    background: #1e1b32;
    border: 1px solid #4b3c72;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    transition: transform 0.2s;
}

.task-card:hover {
    transform: translateY(-2px);
}

.task-content {
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
}

.task-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #2d2650;
    padding: 4px;
}

.task-text {
    flex: 1;
}

.task-name {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
}

.task-desc {
    font-size: 13px;
    color: #cbd5e1;
}

.task-btn {
    background: linear-gradient(to right, #7c3aed, #a855f7);
    color: white;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 12px;
    text-decoration: none;
    white-space: nowrap;
    transition: 0.2s;
}

.task-btn:hover {
    opacity: 0.9;
}
</style>
