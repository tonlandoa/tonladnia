<template>
    <div class="spin-page">
        <div class="container">
            <!-- Бесплатное вращение -->
            <div class="free-spin-card">
                <div class="free-spin-header">
                    🎁 Бесплатное вращение
                    <Gift class="icon" />
                    <ChevronRight class="icon" />
                </div>
                <p class="free-spin-text">
                    Вам необходимо пригласить 2 друзей, чтобы вращать бесплатно
                </p>
            </div>

            <!-- Верхняя стрелка (вниз) -->
            <div class="wheel-arrow wheel-arrow-top"></div>

            <!-- Рулетка -->
            <div class="wheel-strip">
                <div class="wheel-item" v-for="(item, index) in wheels" :key="index">
                    <div class="wheel-circle" :style="{ background: item.color }"
                        :class="{ active: index === Math.floor(wheels.length / 2) }">
                        <component :is="item.icon" class="icon-white" />
                    </div>
                    <div class="wheel-price">
                        {{ item.price }}
                        <Gem class="icon-tiny" />
                    </div>
                </div>
            </div>

            <!-- Нижняя стрелка (вверх) -->
            <div class="wheel-arrow wheel-arrow-bottom"></div>

            <!-- Выбор звёзд -->
            <div class="spin-options">
                <div class="spin-btn" :class="{ active: selected === 50 }" @click="selected = 50">
                    <Star class="icon-tiny" />
                    50
                </div>
                <div class="spin-btn" :class="{ active: selected === 100 }" @click="selected = 100">
                    <Star class="icon-tiny" />
                    100
                </div>
            </div>

            <!-- Кнопка -->
            <button class="main-spin-btn">
                Крутить за {{ selected }} звезд
            </button>

            <!-- Призы -->
            <div class="prize-section">
                <h2>🎉 Список призов</h2>
                <div class="prize-list">
                    <div class="prize-item" v-for="(prize, index) in visiblePrizes" :key="index">
                        <div class="prize-name">{{ prize.name }}</div>
                        <div class="prize-price">
                            {{ prize.price }}
                            <Gem class="icon-tiny" />
                        </div>
                    </div>
                </div>
                <div class="show-more" @click="showAll = !showAll">
                    <ChevronDown class="icon-tiny" />
                    {{ showAll ? 'Скрыть' : 'Показать все' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Gift,
    ChevronRight,
    ChevronDown,
    Gem,
    Star,
    Smartphone,
    Users,
    Apple,
    Package,
} from 'lucide-vue-next'

import { onMounted, computed, ref } from 'vue'

const selected = ref(100)
const showAll = ref(false)

const wheels = [
    { price: 5, color: 'linear-gradient(135deg, #22c55e, #16a34a)', icon: Star },
    { price: 5, color: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', icon: Gem },
    { price: 50, color: 'linear-gradient(135deg, #9333ea, #7c3aed)', icon: Gem },
    { price: 5, color: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', icon: Gem },
    { price: 5, color: 'linear-gradient(135deg, #d946ef, #c026d3)', icon: Gem },
]

const allPrizes = [
    { name: 'iPhone 15 Pro', price: 270 },
    { name: 'Коллекция мемов', price: 900 },
    { name: 'Кепка Ton', price: 200 },
    { name: 'Фрукты', price: 92.5 },
    { name: 'Бонусы', price: 60 },
    { name: 'Наклейки', price: 45 },
]

const visiblePrizes = computed(() => {
    return showAll.value ? allPrizes : allPrizes.slice(0, 4)
})

onMounted(() => {
    // future animation or load logic
})
</script>

<style scoped>
.spin-page {
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    min-height: 100dvh;
    font-family: 'Rubik', sans-serif;
    padding-bottom: 80px;
}

.container {
    max-width: 420px;
    margin: 0 auto;
    padding: 24px 16px;
}

/* Бесплатное вращение */
.free-spin-card {
    background-color: #2b1972;
    border-radius: 16px;
    border: 1px solid #6d28d9;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.3);
}

.free-spin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    color: #facc15;
    margin-bottom: 8px;
}

.free-spin-text {
    font-size: 14px;
    color: #e0e7ff;
}

/* Рулетка */
.wheel-strip {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 12px 0;
    justify-content: center;
    position: relative;
}

.wheel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wheel-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.wheel-circle.active {
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(250, 204, 21, 0.7);
}

.wheel-price {
    margin-top: 4px;
    font-size: 13px;
    color: #e0e7ff;
    display: flex;
    align-items: center;
    gap: 4px;
}

.wheel-arrow {
    width: 0;
    height: 0;
    margin: auto;
}

.wheel-arrow-top {
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 14px solid #facc15;
    margin-bottom: 6px;
}

.wheel-arrow-bottom {
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 14px solid #facc15;
    margin-top: 6px;
    margin-bottom: 16px;
}

/* Звезды */
.spin-options {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 16px;
}

.spin-btn {
    background: #1e293b;
    color: white;
    padding: 8px 18px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    cursor: pointer;
}

.spin-btn.active {
    background: #9333ea;
    border-color: #c084fc;
}

/* Кнопка */
.main-spin-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #7c3aed, #c084fc);
    border: none;
    border-radius: 14px;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
}

.main-spin-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 14px rgba(168, 85, 247, 0.5);
}

/* Призы */
.prize-section {
    margin-top: 24px;
}

.prize-section h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #facc15;
}

.prize-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.prize-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.prize-name {
    color: #e0e7ff;
}

.prize-price {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    color: white;
}

/* Показать все */
.show-more {
    text-align: center;
    font-size: 14px;
    color: #e0e7ff;
    margin-top: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* Иконки */
.icon {
    width: 18px;
    height: 18px;
}

.icon-white {
    color: white;
    width: 20px;
    height: 20px;
}

.icon-tiny {
    width: 16px;
    height: 16px;
}
</style>
