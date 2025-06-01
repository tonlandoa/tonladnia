<template>
    <div class="tasks-section">
        <h2 class="tasks-title">🎯 {{ t('tasks.title') }}</h2>

        <TransitionGroup name="fade" tag="div" appear>
            <div v-for="task in visibleTasks" :key="`task-${task.id}`" class="task-card">
                <div class="task-content">
                    <img :src="task.icon" class="task-icon" />
                    <div class="task-text">
                        <h3 class="task-name">{{ t(`tasks.list.${task.id}.name`) }}</h3>
                        <p class="task-desc">{{ t(`tasks.list.${task.id}.description`) }}</p>
                    </div>
                </div>
                <div class="btn_list">
                    <a :href="task.link" target="_blank" class="task-btn">
                        {{ t('tasks.button') }}
                    </a>
                    <button style="margin-top: 10px; background: orange;" class="task-btn" @click="checkTask(task.id)">
                        {{ t('tasks.button2') }}
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { initData, tg, user_id } from '@/utils/telegramUser'
import api from '@/utils/api'

const { t } = useI18n()

const allTasks = [
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

const visibleTasks = ref([...allTasks])

async function checkTask(id: number) {

    try {
        const response = await api.post('/users/getUser', {
            initData,
            user_id,
            id,
        })

        const data = response.data

        if (data.status === 1) {
            tg.showAlert(t('alert_success_tasks'))
            const index = visibleTasks.value.findIndex(task => task.id === id)
            if (index !== -1) {
                visibleTasks.value.splice(index, 1)
            }
        }
    } catch (error) {
        console.error('Ошибка при выполнении checkTask:', error)
    }
}
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

.btn_list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

/* Анимация появления и исчезновения задач */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
