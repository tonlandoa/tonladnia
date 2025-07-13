<template>
    <div class="game-container">
        <!-- Рука противника -->
        <div style="margin-top: 105px;" class="hand-row top-hand">
            <div class="card enemy-card" v-for="(card, i) in enemyHand" :key="card + i"
                :class="{ hidden: card === enemyCard }">
                <div class="card-back">
                    <div class="card-back-pattern"></div>
                    <div class="card-back-symbol">⚔️</div>
                </div>
            </div>
        </div>

        <!-- Игровое поле -->
        <div class="battlefield">
            <div class="battle-zone">
                <div class="battle-cards-container">
                    <!-- Враг -->
                    <div class="card-with-hp">
                        <transition name="slide-down">
                            <div v-if="enemyCard" class="battle-card-wrapper">
                                <div class="battle-card enemy-battle">
                                    <img :src="enemyCard" />
                                    <div class="card-shine"></div>
                                </div>
                            </div>
                        </transition>
                        <div class="hp-box">❤️ {{ opponentHP }}</div>
                    </div>

                    <div class="vs-divider">VS</div>

                    <!-- Игрок -->
                    <div class="card-with-hp">
                        <transition name="slide-up">
                            <div v-if="playerCard" class="battle-card-wrapper">
                                <div class="battle-card player-battle">
                                    <img :src="playerCard" />
                                    <div class="card-shine"></div>
                                </div>
                            </div>
                        </transition>
                        <div class="hp-box">❤️ {{ playerHP }}</div>
                    </div>
                </div>
            </div>

            <!-- Результат -->
            <transition name="fade-scale">
                <div v-if="showResult" class="result-message">
                    <div class="result-content">
                        <div class="result-icon">
                            {{
                                resultMessage.includes('WIN')
                                    ? '🎉'
                                    : resultMessage.includes('LOSE')
                                        ? '😢'
                                        : '🤝'
                            }}
                        </div>
                        <div class="result-text">{{ resultMessage }}</div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Рука игрока -->
        <div class="hand-row bottom-hand">
            <div class="card player-card" v-for="(card, index) in playerHand" :key="card + index"
                :class="{ disabled: !canPlay, hidden: card === playerCard }"
                @click="canPlay && handlePlay(card, index)">
                <div class="card-inner">
                    <img :src="card" />
                    <div class="card-border"></div>
                    <div class="card-hover-effect"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.game-container {
    padding-bottom: 130px;
    min-height: 100vh;
    padding-left: 20px;
    padding-right: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: white;
    position: relative;
}



.player {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    z-index: 2;
    position: relative;
}

.player-info {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nickname {
    font-size: 18px;
    font-weight: 600;
    color: white;
}

.hp-display {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.hp-icon {
    font-size: 16px;
}

.hp-number {
    font-size: 16px;
    font-weight: 700;
    color: white;
    min-width: 32px;
    text-align: center;
}

.battlefield {
    position: relative;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.battle-zone {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.battle-cards-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
}

.vs-divider {
    font-size: 20px;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    padding: 0 16px;
}

.battle-card-wrapper {
    position: relative;
}

.battle-card {
    width: 110px;
    height: 154px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.battle-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
    animation: shine 2s ease-in-out infinite;
}

@keyframes shine {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}

.hand-row {
    display: flex;
    justify-content: center;
    gap: 16px;
    z-index: 2;
    position: relative;
}

.card {
    width: 90px;
    height: 144px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
}

.card:hover {
    transform: translateY(-12px) scale(1.05);
    z-index: 10;
}

.card.disabled {
    pointer-events: none;
    opacity: 0.5;
    filter: grayscale(0.8);
}

.card.hidden {
    visibility: hidden;
}

.card-inner {
    width: 100%;
    height: 100%;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.card-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 14px;
    pointer-events: none;
    transition: all 0.3s ease;
}

.card:hover .card-border {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

.card-hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover .card-hover-effect {
    opacity: 1;
}

.card-back {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    border-radius: 14px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-back-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M15 15m-4 0a4 4 0 1 1 8 0a4 4 0 1 1-8 0'/%3E%3C/g%3E%3C/svg%3E") repeat;
}

.card-back-symbol {
    font-size: 24px;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.result-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
}

.result-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 24px 32px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1d1d1f;
}

.result-icon {
    font-size: 32px;
}

.result-text {
    font-size: 24px;
    font-weight: 700;
    color: #1d1d1f;
}

/* Анимации */
.slide-down-enter-active {
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-80px) scale(0.8);
}

.slide-down-leave-active {
    transition: all 0.4s ease-in;
}

.slide-down-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.slide-up-enter-active {
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(80px) scale(0.8);
}

.slide-up-leave-active {
    transition: all 0.4s ease-in;
}

.slide-up-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.fade-scale-enter-active {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-scale-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
}

.fade-scale-leave-active {
    transition: all 0.3s ease-in;
}

.fade-scale-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
}

/* Адаптивность */
@media (max-width: 768px) {


    .player-info {
        padding: 12px 20px;
        gap: 12px;
    }

    .nickname {
        font-size: 16px;
    }

    .hp-display {
        padding: 6px 12px;
    }

    .hp-number {
        font-size: 14px;
    }

    .battle-zone {
        padding: 24px;
    }

    .battle-cards-container {
        gap: 16px;
    }




    .hand-row {
        gap: 12px;
    }

    .result-content {
        padding: 20px 24px;
    }

    .result-icon {
        font-size: 28px;
    }

    .result-text {
        font-size: 20px;
    }
}

.card-with-hp {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.hp-box {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    padding: 6px 14px;
    font-weight: 700;
    font-size: 16px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
<script setup lang="ts">
import {

    tg

} from '@/utils/telegramUser'




import { ref, onMounted } from 'vue'

const cardMap: Record<number, string> = {
    6: '/img/6.png', 7: '/img/7.png', 8: '/img/8.png', 9: '/img/9.png',
    10: '/img/10.png', 11: '/img/11.png', 12: '/img/12.png', 13: '/img/13.png',
    14: '/img/14.png', 15: '/img/15.png', 16: '/img/16.jpg', 17: '/img/17.jpg',
    18: '/img/18.jpg', 19: '/img/19.jpg', 20: '/img/20.jpg', 21: '/img/21.jpg',
    22: '/img/22.jpg', 23: '/img/23.jpg', 24: '/img/24.jpg', 25: '/img/25.jpg',
}
const cardPaths = Object.values(cardMap)

const playerHP = ref(100)
const opponentHP = ref(100)

const playerHand = ref<string[]>([])
const enemyHand = ref<string[]>([])

const playerCard = ref<string | null>(null)
const enemyCard = ref<string | null>(null)

const canPlay = ref(false)
const showResult = ref(false)
const resultMessage = ref('')

function getCardValue(card: string): number {
    const match = card.match(/\/(\d+)\.(png|jpg)$/)
    return match ? parseInt(match[1]) : 0
}

function getRandomCards(count: number): string[] {
    return [...cardPaths].sort(() => 0.5 - Math.random()).slice(0, count)
}

function startRound() {
    const cards = getRandomCards(8)
    playerHand.value = cards.slice(0, 4)
    enemyHand.value = cards.slice(4, 8)
    playerCard.value = null
    enemyCard.value = null
    resultMessage.value = ''
    showResult.value = false
    canPlay.value = false

    setTimeout(() => {
        enemyMove()
    }, 2000)
}

function enemyMove() {
    const randomIndex = Math.floor(Math.random() * enemyHand.value.length)
    enemyCard.value = enemyHand.value[randomIndex]
    canPlay.value = true
}

function handlePlay(card: string, index: number) {
    if (!canPlay.value) return

    playerCard.value = card
    playerHand.value.splice(index, 1)
    canPlay.value = false

    setTimeout(() => {
        const playerValue = getCardValue(playerCard.value!)
        const enemyValue = getCardValue(enemyCard.value!)

        if (playerValue > enemyValue) {
            resultMessage.value = 'YOU WIN!'
            opponentHP.value = Math.max(opponentHP.value - 25, 0)
        } else if (playerValue < enemyValue) {
            resultMessage.value = 'YOU LOSE!'
            playerHP.value = Math.max(playerHP.value - 25, 0)
        } else {
            resultMessage.value = 'DRAW!'
        }

        showResult.value = true

        setTimeout(() => {
            // удалить карту врага ТОЛЬКО после анимации
            if (enemyCard.value) {
                const idx = enemyHand.value.indexOf(enemyCard.value)
                if (idx !== -1) enemyHand.value.splice(idx, 1)
            }

            playerCard.value = null
            enemyCard.value = null
            showResult.value = false

            if (playerHand.value.length === 0 && enemyHand.value.length === 0) {
                if (playerHP.value > opponentHP.value) {
                    resultMessage.value = 'YOU WIN THE ROUND!'
                } else if (playerHP.value < opponentHP.value) {
                    resultMessage.value = 'YOU LOSE THE ROUND!'
                } else {
                    resultMessage.value = 'DRAW ROUND!'
                }

                showResult.value = true
                setTimeout(() => {
                    startRound()
                }, 3000)
            } else {
                setTimeout(() => {
                    enemyMove()
                }, 2000)
            }
        }, 2000)
    }, 1000)
}

tg?.requestFullscreen?.();

onMounted(() => {
    startRound()

})
</script>
