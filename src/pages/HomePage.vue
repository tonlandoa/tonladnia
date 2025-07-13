<script setup lang="ts">
import { useTonWallet } from '@/utils/useTonWallet'
const { isWalletConnected, formattedAddress, onWalletClick } = useTonWallet()

import { createCountdown } from '@/utils/useCountdown'
import {
    startParam,
    photo_url,
    initData,
    tg,
    user_id,
    username,
    language_code
} from '@/utils/telegramUser'

import api from '@/utils/api'
import PageLoader from './pageLoader.vue'

import {
    TrendingUp,
    DollarSign,
    PiggyBank,
    Play,
    Clock,
    Flame,
    Wallet,
    ChevronUp,
    ChevronDown,
} from 'lucide-vue-next'

import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentLang = ref(locale.value)
const open = ref(false)

const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'ua', label: 'Українська' },
]

function toggleDropdown() {
    open.value = !open.value
}

function setLang(lang: string) {
    open.value = false
    currentLang.value = lang
    locale.value = lang
}
const showSubModal = ref(false)

function closeSubModal() {
    showSubModal.value = false
}


if (startParam == 'MiniGameGo0123') {
    location.href = '/minigame';
}

const clanCards = ref([
    {
        id: 15,
        name: 'INFLUENSER CARD',
        image: '/img/infl.png',
        profit: '5%',
        cost: 'TON 10',
        cycle: '24ч',
        earned: '0_ton',
        potential: '20 TON',
        frozen: false,
        buy: false
    },
    {
        id: 4,
        name: 'SHIBA',
        image: '/img/shiba.png',
        profit: '5%',
        cost: 'TON 15',
        cycle: '24ч',
        earned: '0_ton',
        potential: '30 TON',
        frozen: false,
        buy: true
    },
    {
        id: 1,
        name: 'pepe',
        image: '/img/pepafinal.png',
        profit: '5_percent',
        cost: '1_ton',
        cycle: '24h',
        earned: '0_ton',
        potential: '2_ton',
        frozen: false,
        buy: true
    },
    {
        id: 2,
        name: 'DOGS',
        image: '/img/doge.png',
        profit: '5_percent',
        cost: '5 TON',
        cycle: '24h',
        earned: '0_ton',
        potential: '10 TON',
        frozen: false,
        buy: true
    },
    {
        id: 3,
        name: 'DOGE',
        image: '/img/dogefinal.png',
        profit: '5%',
        cost: '7 TON',
        cycle: '24ч',
        earned: '0_ton',
        potential: '14 TON',
        frozen: false,
        buy: true
    },

    {
        id: 5, name: 'coming_soon', image: '/img/floki.png', profit: 'coming_soon', cost: 'coming_soon', cycle: 'coming_soon', earned: 'coming_soon', potential: 'coming_soon', frozen: true, buy: true
    },
    {
        id: 6, name: 'coming_soon', image: '/img/clyton.png', profit: 'coming_soon', cost: 'coming_soon', cycle: 'coming_soon', earned: 'coming_soon', potential: 'coming_soon', frozen: true, buy: true
    },
    {
        id: 7, name: 'coming_soon', image: '/img/tonzilla.png', profit: 'coming_soon', cost: 'coming_soon', cycle: 'coming_soon', earned: 'coming_soon', potential: 'coming_soon', frozen: true, buy: true
    },
    {
        id: 8, name: 'coming_soon', image: '/img/ping.png', profit: 'coming_soon', cost: 'coming_soon', cycle: 'coming_soon', earned: 'coming_soon', potential: 'coming_soon', frozen: true, buy: true
    },
])

const textVariants = computed(() => [
    t('typewriter_texts.0'),
    t('typewriter_texts.1'),
    t('typewriter_texts.2'),
    t('typewriter_texts.3'),
])
const displayedText = ref('')
let currentTextIndex = 0
let currentCharIndex = 0
let typing = true
const typeWriterEffect = () => {
    const variants = textVariants.value
    if (!variants.length) return
    const current = variants[currentTextIndex]
    if (typing) {
        if (currentCharIndex < current.length) {
            displayedText.value += current[currentCharIndex]
            currentCharIndex++
            setTimeout(typeWriterEffect, 80)
        } else {
            typing = false
            setTimeout(typeWriterEffect, 1500)
        }
    } else {
        if (currentCharIndex > 0) {
            displayedText.value = current.slice(0, currentCharIndex - 1)
            currentCharIndex--
            setTimeout(typeWriterEffect, 50)
        } else {
            typing = true
            currentTextIndex = (currentTextIndex + 1) % variants.length
            setTimeout(typeWriterEffect, 500)
        }
    }
}

const userData = ref<Record<string, any> | null>(null)
const countdownPerPlanet = ref<Record<number, string>>({})
const loaderRef = ref<InstanceType<typeof PageLoader> | null>(null)

const getUser = async () => {
    await loaderRef.value?.withLoader(async () => {
        const { data } = await api.post('/users/getUser', {
            initData, user_id, username, language_code, photo_url, startParam
        })

        userData.value = data

        if (data.sub_channel === 1) {
            showSubModal.value = true
        }

        const updatedCards = [...clanCards.value]
        const now = new Date(data.date.replace(/-/g, '/')).getTime()

        updatedCards.forEach((card) => {
            const id = card.id
            const incomeKey = `card_${id}_income`
            const timeKey = `time_card_${id}`
            const cardKey = `card_${id}`

            if (data[incomeKey] !== undefined) {
                card.earned = `${data[incomeKey]} TON`
            }

            if (data[cardKey] === 1 && data[timeKey]) {
                const endTime = new Date(data[timeKey].replace(/-/g, '/')).getTime()
                if (endTime > now) {
                    createCountdown(data.date, data[timeKey], (formatted) => {
                        countdownPerPlanet.value[id] = formatted
                    })
                }
            }
        })

        clanCards.value = updatedCards
    })
}

// Вычисляемое свойство для фильтрации карточек
const filteredClanCards = computed(() => {
    return clanCards.value.filter(card => {
        // Если buy: false, показывать только если пользователь владеет карточкой
        if (card.buy === false) {
            const cardKey = `card_${card.id}`
            return userData.value?.[cardKey] === 1
        }
        // Если buy: true или не определено, показывать всем
        return true
    })
})

onMounted(() => {
    getUser()
    typeWriterEffect()
})

const showModal = ref(false)
const selectedCard = ref<any>(null)
const wasActivated = ref(false)

async function openModal(card: any) {
    selectedCard.value = card
    const cardKey = `card_${card.id}`
    const userHasCard = userData.value?.[cardKey] === 1

    if (userHasCard) {
        wasActivated.value = true
        showModal.value = true

        const res = await api.post('/users/activeMem', {
            initData,
            user_id,
            card_id: card.id
        })

        if (res.data.status === 1) {
            const { time, new_date } = res.data
            if (time && new_date) {
                createCountdown(time, new_date, (formatted) => {
                    countdownPerPlanet.value[card.id] = formatted
                })
            }
        }
    } else {
        wasActivated.value = false
        showModal.value = true
    }
}

function closeModal() {
    showModal.value = false
    selectedCard.value = null
    wasActivated.value = false
}

const buyCard = async (card_id: number) => {
    return await api.post('/users/buyCard', {
        initData,
        user_id,
        card_id
    })
}

async function confirmBuy() {
    if (!selectedCard.value) return
    const cardId = selectedCard.value.id

    const result = await buyCard(cardId)

    if (result.data.status === 1) {
        const { time, new_time } = result.data
        if (time && new_time) {
            createCountdown(time, new_time, (formatted) => {
                countdownPerPlanet.value[cardId] = formatted
            })
        }

        userData.value = userData.value || {}
        userData.value[`card_${cardId}`] = 1
    } else {
        tg.showAlert(t('not_enough_ton'))
    }

    closeModal()
}
</script>

<template>
    <PageLoader ref="loaderRef" />

    <!-- SUB MODAL -->
    <div v-if="showSubModal" class="modal-overlay" @click.self="closeSubModal">
        <div class="modal-content">
            <button class="modal-close" @click="closeSubModal">×</button>
            <h2>{{ t('modal.subscribeTitle') }}</h2>
            <p>{{ t('modal.subscribeDescription') }}</p>
            <a href="https://t.me/TonlandiaCommunity" target="_blank" class="modal-btn">
                {{ t('modal.subscribeButton') }}
            </a>

        </div>
    </div>

    <div class="clan-page">
        <div class="balance-header">
            <button @click="onWalletClick" class="tonconnect-btn">
                <Wallet class="ton-logo" />
                {{ isWalletConnected ? formattedAddress : 'Connect Wallet' }}
            </button>

            <div class="language-wrapper">
                <div class="language-menu" @click="toggleDropdown">
                    <img :src="`/img/${currentLang}.svg`" class="flag-icon" alt="Lang" />
                    <component :is="open ? ChevronUp : ChevronDown" class="arrow-icon" />
                </div>
                <div v-if="open" class="dropdown">
                    <div v-for="lang in languages" :key="lang.code" class="dropdown-item" @click="setLang(lang.code)">
                        <img :src="`/img/${lang.code}.svg`" class="flag-icon" />
                        <span>{{ lang.label }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h1 class="headline">
                <span class="tonlandia-title">TONLANDIA</span> —
                <span class="typed-text">{{ displayedText }}</span><span class="cursor">|</span>
            </h1>


            <div class="nft-banner">
                <img src="/img/os.png" alt="NFT" class="nft-image" />
                <div class="nft-text-block">
                    <h2 class="nft-title">{{ $t('nft_unique_title') }}</h2>
                    <p class="nft-subtitle">{{ $t('nft_unique_subtitle') }}</p>
                    <a class="nft-mint-btn" href="/mint">
                        MINT NOW GO!
                    </a>
                </div>
            </div>



            <h1 class="headline">{{ $t('buy_memes') }}</h1>

            <div class="clan-list">
                <div v-for="card in filteredClanCards" :key="card.id" class="clan-card">
                    <div class="img_block">
                        <div class="card-image">
                            <img :src="card.image" alt="clan" class="card-img" />
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="top-row">
                            <h2 class="name">{{ $t(card.name) }}</h2>
                        </div>

                        <div class="info-row">
                            <TrendingUp class="mini-icon text-blue" />
                            <span class="label">{{ $t('profitability') }}</span>
                            <span class="value text-blue">{{ $t(card.profit) }}</span>
                        </div>
                        <div class="info-row">
                            <DollarSign class="mini-icon text-green" />
                            <span class="label">{{ $t('price') }}</span>
                            <span class="value text-green">{{ $t(card.cost) }}</span>
                        </div>
                        <div class="info-row">
                            <Clock class="mini-icon text-default" />
                            <span class="label">{{ $t('cycle_time') }}</span>
                            <span class="value text-default">{{ $t(card.cycle) }}</span>
                        </div>
                        <div class="info-row">
                            <PiggyBank class="mini-icon text-red" />
                            <span class="label">{{ $t('earned') }}</span>
                            <span class="value text-red">{{ $t(card.earned) }}</span>
                        </div>
                        <div class="info-row">
                            <Flame class="mini-icon text-orange" />
                            <span class="label">{{ $t('potential_profit') }}</span>
                            <span class="value text-orange">{{ $t(card.potential) }}</span>
                        </div>

                        <div v-if="card.id === 1 && countdownPerPlanet[1]" class="info-row">
                            <Clock class="mini-icon text-default" />
                            <span class="label">{{ $t('next_cycle') }}</span>
                            <span class="value text-default">{{ countdownPerPlanet[1] }}</span>
                        </div>

                        <div v-if="card.id === 2 && countdownPerPlanet[2]" class="info-row">
                            <Clock class="mini-icon text-default" />
                            <span class="label">{{ $t('next_cycle') }}</span>
                            <span class="value text-default">{{ countdownPerPlanet[2] }}</span>
                        </div>

                        <div v-if="card.id === 3 && countdownPerPlanet[3]" class="info-row">
                            <Clock class="mini-icon text-default" />
                            <span class="label">{{ $t('next_cycle') }}</span>
                            <span class="value text-default">{{ countdownPerPlanet[3] }}</span>
                        </div>

                        <button class="start-btn" @click="openModal(card)" :disabled="(card.id === 1 && !!countdownPerPlanet[1]) ||
                            (card.id === 2 && !!countdownPerPlanet[2]) ||
                            (card.id === 3 && !!countdownPerPlanet[3]) ||
                            (card.id === 4 && !!countdownPerPlanet[4]) ||
                            (card.id === 15 && !!countdownPerPlanet[15])">
                            <Play class="play-icon" />
                            {{
                                card.id === 1
                                    ? userData?.card_1 !== 1
                                        ? $t('buy')
                                        : countdownPerPlanet[1]
                                            ? countdownPerPlanet[1]
                                            : $t('start')
                                    : card.id === 2
                                        ? userData?.card_2 !== 1
                                            ? $t('buy')
                                            : countdownPerPlanet[2]
                                                ? countdownPerPlanet[2]
                                                : $t('start')
                                        : card.id === 3
                                            ? userData?.card_3 !== 1
                                                ? $t('buy')
                                                : countdownPerPlanet[3]
                                                    ? countdownPerPlanet[3]
                                                    : $t('start')
                                            : card.id === 4
                                                ? userData?.card_4 !== 1
                                                    ? $t('buy')
                                                    : countdownPerPlanet[4]
                                                        ? countdownPerPlanet[4]
                                                        : $t('start')
                                                : card.id === 15
                                                    ? userData?.card_15 !== 1
                                                        ? $t('buy')
                                                        : countdownPerPlanet[15]
                                                            ? countdownPerPlanet[15]
                                                            : $t('start')
                                                    : $t('start')
                            }}
                        </button>


                    </div>

                    <div v-if="card.frozen" class="card-overlay">
                        <span class="overlay-text">{{ $t('coming_soon') }}</span>
                    </div>
                </div>
            </div>


        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <template v-if="wasActivated">
                    <h2 class="modal-title">{{ $t('activated') }}</h2>
                    <p class="modal-text">{{ $t('meme_successfully_activated') }}</p>
                    <div class="modal-buttons">
                        <button class="modal-btn confirm" @click="closeModal">{{ $t('ok') }}</button>
                    </div>
                </template>
                <template v-else>
                    <h2 class="modal-title">{{ $t('confirmation') }}</h2>
                    <p class="modal-text">{{ $t('are_you_sure_to_buy') }} "{{ $t(selectedCard.name) }}"?</p>
                    <div class="modal-buttons">
                        <button class="modal-btn confirm" @click="confirmBuy">{{ $t('confirm') }}</button>
                        <button class="modal-btn cancel" @click="closeModal">{{ $t('cancel') }}</button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;700&display=swap');

.language-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}


.flag-icon {
    width: 24px;
    height: 24px;
}

.arrow-icon {
    width: 18px;
    height: 18px;
}

.dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    background-color: #1c2438;
    border: 1px solid #2e374a;
    border-radius: 10px;
    padding: 5px 0;
    width: 150px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background-color: #2a3245;
}

.div_os {
    display: flex;
    justify-content: center;
}

.nft-mint-btn {
    margin-top: 12px;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: white;
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
}

.nft-mint-btn.sold-out {
    background: #d1d5db;
    /* ярко-серый */
    color: #6b7280;
    /* тёмно-серый текст */
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
    transform: none;
}

.nft-mint-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}


.headline {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    font-family: 'Rubik', sans-serif;
    color: #facc15;
}

.typed-text {
    color: #fff;
}

.tonlandia-title {
    font-size: 48px;
    font-weight: 900;
    color: #facc15;
    text-shadow:
        -2px -2px 0 #000,
        2px -2px 0 #000,
        -2px 2px 0 #000,
        2px 2px 0 #000,
        3px 3px 0 #7c3aed;
}

.cursor {
    display: inline-block;
    width: 1px;
    background: #fff;
    animation: blink 0.7s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

.nft-banner {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #4c1d95, #7e22ce);
    border: 2px solid #9333ea;
    border-radius: 16px;
    padding: 12px 16px;
    margin: 16px 0;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.nft-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 12px;

    padding: 4px;
}

.nft-text-block {
    display: flex;
    flex-direction: column;
    color: #fff;
    text-align: left;
    flex: 1;
}

.nft-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #facc15;
}

.nft-subtitle {
    font-size: 14px;
    margin-top: 4px;
    color: #e0e7ff;
}

.clan-page {
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    min-height: 100dvh;
    padding-top: 35px;
    padding-bottom: 100px;
    font-family: 'Rubik', sans-serif;
    overflow-x: hidden;
}

.img_os {
    max-width: 100%;
    width: 350px;
}

.tonconnect-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #0098ea;
    color: white;
    border: 1px solid #023e5e;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 18px;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
    font-family: 'Inter', sans-serif;
}

.ton-logo {
    width: 20px;
    height: 20px;
}

.balance-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #2d1d56;
    border-bottom: 1px solid #3d2d6d;
}

.container {
    max-width: 420px;
    margin: auto;
    padding: 32px 16px 0;
}

.clan-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.clan-card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.img_block {
    display: flex;
    justify-content: center;
}

.card-image {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 7px;
}

.card-img {
    margin-top: 10px;
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: contain;
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

.card-body {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 0;
}

.top-row {
    text-align: center;
}

.name {
    font-size: 25px;
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 10px;
}

.info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    background: rgba(168, 85, 247, 0.1);
    padding: 6px 10px;
    border-radius: 8px;
    gap: 6px;
}

.label {
    flex: 1;
    color: #e0e7ff;
}

.value {
    font-weight: 600;
    font-size: 16px;
}

.text-blue {
    color: #38bdf8;
}

.text-green {
    color: #34d399;
}

.text-red {
    color: #f87171;
}

.text-default {
    color: #e0e7ff;
}

.text-orange {
    color: #fb923c;
}

.mini-icon {
    width: 16px;
    height: 16px;
    color: inherit;
    opacity: 0.9;
    flex-shrink: 0;
    color: #facc15;
}

.start-btn {
    background: linear-gradient(135deg, #7c3aed, #c084fc);
    border: none;
    color: #fff;
    padding: 10px 12px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    transition: 0.2s ease;
}

.start-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
}

.play-icon {
    width: 16px;
    height: 16px;
}

.card-overlay {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(6px);
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.overlay-text {
    font-size: 18px;
    font-weight: 700;
    color: #fef3c7;
    background: rgba(0, 0, 0, 0.6);
    padding: 8px 16px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}


.language-menu {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #2c2f3b;
    background-color: #161c2d;
    transition: background 0.2s;
}

.language-menu:hover {
    background-color: #1f2637;
}

.flag-icon {
    width: 24px;
    height: 24px;
}

.arrow-icon {
    width: 18px;
    height: 18px;
}

.dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    background-color: #1c2438;
    border: 1px solid #2e374a;
    border-radius: 10px;
    padding: 5px 0;
    width: 150px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background-color: #2a3245;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: #1f1b35;
    border: 1px solid #4b3c72;
    border-radius: 16px;
    padding: 24px;
    padding-top: 5px;
    padding-bottom: 15px;
    width: 90%;
    max-width: 350px;
    text-align: center;
    color: white;
}

.modal-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #facc15;
}

.modal-text {
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.4;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.modal-btn {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s ease;
}

.modal-btn.confirm {
    background: linear-gradient(135deg, #7c3aed, #c084fc);
    color: white;
    border: none;
}

.modal-btn.cancel {
    background: #374151;
    color: #e5e7eb;
    border: none;
}

.modal-content h2 {
    font-size: 26px;
    margin-top: 30px;
    margin-bottom: 20px;
}

.modal-content p {
    font-size: 16px;
    margin-bottom: 30px;
}

.modal-btn {
    background: #7d4dff;
    color: white;
    padding: 14px 24px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 12px;
    text-decoration: none;
    display: inline-block;
    transition: background 0.3s;
}

.modal-btn:hover {
    background: #5c30d4;
}

.modal-close {
    position: absolute;
    top: 16px;
    right: 20px;
    font-size: 28px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
}

.modal-content {
    position: relative;
}
</style>
