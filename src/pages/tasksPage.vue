<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { initData, tg, user_id } from '@/utils/telegramUser'
import api from '@/utils/api'
import PageLoader from './pageLoader.vue'

const { t } = useI18n()

const allTasks = [
    {
        id: 5,
        link: 'https://t.me/CivilizationTon_bot/app?startapp=856873356',
        icon: '/civi.jpg',
        pin: true,
    },
    {
        id: 1,
        link: 'https://t.me/TonlandiaCommunity',
        icon: '/img/channel.jpg',
        pin: false,
    },
    {
        id: 2,
        link: 'https://t.me/TonlandiaChat',
        icon: '/img/pepafinal.png',
        pin: false,
    },
    {
        id: 3,
        icon: '/img/os.png',
        pin: true,
    },
    {
        id: 4,
        link: 'https://t.me/MineVerseBot/app?startapp=r_100000000080',
        icon: '/img/logo_mineverse.png',
        pin: true,
    },
]

const visibleTasks = ref([...allTasks])
const clickedTasks = ref<number[]>([])
const loaderRef = ref<InstanceType<typeof PageLoader> | null>(null)

const getTasks = async () => {
    await loaderRef.value?.withLoader(async () => {
        const { data } = await api.post('/users/getTasksUser', {
            initData,
            user_id,
        })

        const completedIds = data.tasks.map((task: any) => task.tasks_id)

        visibleTasks.value = allTasks
            .filter(task => !completedIds.includes(task.id))
            .sort((a, b) => Number(b.pin || false) - Number(a.pin || false))
    })
}

function markTaskAsClicked(id: number) {
    if (!clickedTasks.value.includes(id)) {
        clickedTasks.value.push(id)
    }
}

function isTaskClicked(id: number): boolean {
    return clickedTasks.value.includes(id)
}

function handleCustomTask(id: number) {
    const mediaUrl = 'https://www.tonlandia.dev/img/last.png';

    tg.shareToStory(mediaUrl, {
        text: 'https://t.me/TONlandiaBot/game?startapp=' + user_id + ' 🐸 Зарабатывать на мемах уже сейчас! #TONlandia',
        widget_link: {
            url: 'https://t.me/TONlandiaBot/game?startapp=' + user_id,
            name: '🐸 EARN TON FOR MEME'
        }
    });
    markTaskAsClicked(id)
}

async function checkTask(id: number) {
    try {
        const response = await api.post('/users/checkTasks', {
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
        } else {
            tg.showAlert('Error Tasks')
        }
    } catch (error) {
        console.error('Ошибка при выполнении checkTask:', error)
    }
}

onMounted(() => {
    getTasks()
})
</script>

<template>
    <PageLoader ref="loaderRef" />
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
                    <!-- Условная кнопка: ссылка или alert -->
                    <template v-if="task.id === 1 || task.id === 2 || task.id === 4 || task.id === 5">
                        <a :href="task.link" target="_blank" class="task-btn" @click="markTaskAsClicked(task.id)">
                            {{ t('tasks.button') }}
                        </a>
                    </template>
                    <template v-else>
                        <button class="task-btn" @click="handleCustomTask(task.id)">
                            {{ t('tasks.button') }}
                        </button>
                    </template>

                    <!-- Проверка выполнения -->
                    <button style="margin-top: 10px; background: orange;" class="task-btn"
                        :disabled="!isTaskClicked(task.id)" @click="checkTask(task.id)">
                        {{ t('tasks.button2') }}
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

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

.task-btn:disabled {
    background: gray !important;
    cursor: not-allowed;
    opacity: 0.6;
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
