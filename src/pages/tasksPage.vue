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
        type: 'partner',
    },
    {
        id: 1,
        link: 'https://t.me/TonlandiaCommunity',
        icon: '/img/channel.jpg',
        pin: true,
        type: 'main',
    },
    {
        id: 2,
        link: 'https://t.me/TonlandiaChat',
        icon: '/img/pepafinal.png',
        pin: true,
        type: 'main',
    },
    {
        id: 3,
        icon: '/img/os.png',
        pin: true,
        type: 'main',
    },
    {
        id: 4,
        link: 'https://t.me/MineVerseBot/app?startapp=r_100000000080',
        icon: '/img/logo_mineverse.png',
        pin: true,
        type: 'partner',
    },
    {
        id: 6,
        link: 'https://t.me/vadim_maslow',
        icon: '/img/vadim.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 7,
        link: 'https://t.me/team_krm',
        icon: '/img/leha.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 8,
        link: 'https://t.me/+mQ8_XURNp7oyNjEy',
        icon: '/img/invest_crypta_mining.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 9,
        link: 'https://t.me/toncorpcrypto',
        icon: '/img/cryptofarm.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 10,
        link: 'https://t.me/Money_Mining_Bot/MoneyMiningGame?startapp=7281288177',
        icon: '/img/money.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 11,
        link: 'https://t.me/+0EA3BVmp88RlYzBl',
        icon: '/img/necrypto.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 12,
        link: 'https://t.me/+BFoYmPFODlo3Mzcy',
        icon: '/img/1.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 13,
        link: 'https://t.me/+HaCC_sUEUYsyMGRi',
        icon: '/img/oleg.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 14,
        link: 'https://t.me/+99vrgNWFF_1kMDUy',
        icon: '/img/andi.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 15,
        link: 'https://t.me/+SIpJlnzdi3xmOGMy',
        icon: '/img/kit.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 16,
        link: 'https://t.me/+JqHm6r8SnS42NzRi',
        icon: '/img/pugach.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 17,
        link: 'https://t.me/DropKriptozona',
        icon: '/img/dropk.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 18,
        link: 'https://t.me/+KuWQTepOcas5MjEy',
        icon: '/img/btc.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 19,
        link: 'https://t.me/+hfzC-NfZyAg2ODBi',
        icon: '/img/compas.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 20,
        link: 'https://t.me/+H8bdJOSDUjZjZWMy',
        icon: '/img/boroda.png',
        pin: true,
        type: 'partner',
    },
    {
        id: 21,
        link: 'https://t.me/antizarplata',
        icon: '/img/anti.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 22,
        link: 'https://t.me/crazymoney778',
        icon: '/img/crazy.jpg',
        pin: true,
        type: 'partner',
    },
    {
        id: 23,
        link: 'https://t.me/+FbxeGPmuPlUyMzgy',
        icon: '/img/goblin.jpg',
        pin: true,
        type: 'partner',
    }
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

        <div class="task-group">
            <h3 class="task-group-title">Main</h3>
            <TransitionGroup name="fade" tag="div" appear>
                <div v-for="task in visibleTasks.filter(t => t.type === 'main')" :key="`task-${task.id}`"
                    class="task-card">
                    <div class="task-content">
                        <img :src="task.icon" class="task-icon" />
                        <div class="task-text">
                            <h3 class="task-name">{{ t(`tasks.list.${task.id}.name`) }}</h3>
                            <p class="task-desc">{{ t(`tasks.list.${task.id}.description`) }}</p>
                        </div>
                    </div>
                    <div class="btn_list">
                        <button class="task-btn" @click="handleCustomTask(task.id)">
                            {{ t('tasks.button') }}
                        </button>
                        <button style="margin-top: 10px; background: orange;" class="task-btn"
                            :disabled="!isTaskClicked(task.id)" @click="checkTask(task.id)">
                            {{ t('tasks.button2') }}
                        </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>

        <div class="task-group">
            <h3 class="task-group-title">Partners</h3>
            <TransitionGroup name="fade" tag="div" appear>
                <div v-for="task in visibleTasks.filter(t => t.type === 'partner')" :key="`task-${task.id}`"
                    class="task-card">
                    <div class="task-content">
                        <img :src="task.icon" class="task-icon" />
                        <div class="task-text">
                            <h3 class="task-name">{{ t(`tasks.list.${task.id}.name`) }}</h3>
                            <p class="task-desc">{{ t(`tasks.list.${task.id}.description`) }}</p>
                        </div>
                    </div>
                    <div class="btn_list">
                        <a :href="task.link" target="_blank" class="task-btn" @click="markTaskAsClicked(task.id)">
                            {{ t('tasks.button') }}
                        </a>
                        <button style="margin-top: 10px; background: orange;" class="task-btn"
                            :disabled="!isTaskClicked(task.id)" @click="checkTask(task.id)">
                            {{ t('tasks.button2') }}
                        </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped>
.tasks-section {

    padding: 20px;
    padding-bottom: 100px;
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

.task-group {
    margin-bottom: 30px;
}

.task-group-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #b8b8ff;
    text-transform: uppercase;
    border-left: 4px solid #a855f7;
    padding-left: 10px;
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
