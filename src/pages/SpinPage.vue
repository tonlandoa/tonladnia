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
        <p class="free-spin-text">Вам необходимо пригласить 2 друзей, чтобы вращать бесплатно</p>
      </div>

      <!-- Указатель -->
      <div class="wheel-arrow wheel-arrow-top"></div>

      <!-- Рулетка -->
      <div class="wheel-wrapper">
        <div class="wheel-strip" ref="wheelRef">
          <div class="wheel-item" v-for="(item, index) in wheels" :key="index">
            <div class="wheel-circle" :style="{ background: item.color }">
              <component :is="item.icon" class="icon-white" />
            </div>
            <div class="wheel-price">
              {{ item.price }}
              <Gem class="icon-tiny" />
            </div>
          </div>
        </div>
      </div>

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
      <button class="main-spin-btn" @click="spin" :disabled="isSpinning">
        <template v-if="isSpinning">
          <span class="loader"></span>
        </template>
        <template v-else>
          Крутить за {{ selected }} звезд
        </template>
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

    <!-- Модалка с призом -->
    <div v-if="prizeModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>🎁 Вы выиграли</h2>
        <div class="modal-prize" :style="{ background: wonPrize?.color }">
          <component :is="wonPrize?.icon" class="icon-white" />
        </div>
        <div class="modal-price">
          {{ wonPrize?.price }} <Gem class="icon-tiny" />
        </div>
        <button class="modal-button" @click="closeModal">OK</button>
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
} from 'lucide-vue-next'
import { ref, computed, nextTick, onMounted } from 'vue'

const icons = [Star, Gem]

function generateItem() {
  return {
    price: Math.floor(Math.random() * 100) + 5,
    color: `linear-gradient(135deg, hsl(${Math.random() * 360}, 80%, 60%), hsl(${Math.random() * 360}, 70%, 50%))`,
    icon: icons[Math.floor(Math.random() * icons.length)],
  }
}

const wheels = ref(Array.from({ length: 10 }, generateItem))
const selected = ref(100)
const showAll = ref(false)
const isSpinning = ref(false)
const prizeModal = ref(false)
const wonPrize = ref(null)
const wheelRef = ref(null)
let totalOffset = 0

// Инициализация позиции рулетки
const initializeWheel = async () => {
  await nextTick()
  const strip = wheelRef.value
  if (!strip) return
  
  // Начинаем с небольшого смещения, чтобы первый элемент не был полностью слева
  const initialOffset = 50
  strip.style.transform = `translateX(-${initialOffset}px)`
  totalOffset = initialOffset

  totalOffset = -initialOffset
}

// Вызываем инициализацию после монтирования
onMounted(initializeWheel)

const spin = async () => {
  if (isSpinning.value) return
  isSpinning.value = true

  // Добавляем новые элементы
  const newItems = Array.from({ length: 15 }, generateItem)
  wheels.value.push(...newItems)

  await nextTick()

  const strip = wheelRef.value
  if (!strip) return

  const itemWidth = 70
  
  // Заранее выбираем выигрышный элемент из новых
  const winningIndex = wheels.value.length - newItems.length + Math.floor(Math.random() * 10)
  
  // Простое смещение на несколько элементов вперед (от текущей позиции)
  const elementsToMove = Math.floor(Math.random() * 8) + 12 // 12-19 элементов
  const moveDistance = elementsToMove * itemWidth
  const finalPosition = totalOffset + moveDistance
  
  // Применяем вращение
  strip.style.transition = 'transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  strip.style.transform = `translateX(-${finalPosition}px)`
  
  totalOffset = finalPosition

  setTimeout(() => {
    // Вычисляем какой элемент примерно в центре и берем ближайший
    const approximateIndex = Math.floor(totalOffset / itemWidth)
    const finalIndex = Math.min(approximateIndex + Math.floor(Math.random() * 3), wheels.value.length - 1)
    
    wonPrize.value = wheels.value[finalIndex]
    prizeModal.value = true
    isSpinning.value = false
  }, 2600)
}

const closeModal = () => {
  prizeModal.value = false
}

const allPrizes = [
  { name: 'iPhone 15 Pro', price: 270 },
  { name: 'Коллекция мемов', price: 900 },
  { name: 'Кепка Ton', price: 200 },
  { name: 'Фрукты', price: 92.5 },
  { name: 'Бонусы', price: 60 },
  { name: 'Наклейки', price: 45 },
]

const visiblePrizes = computed(() => showAll.value ? allPrizes : allPrizes.slice(0, 4))
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

.wheel-wrapper {
  overflow: hidden;
  margin: 10px 0;
  position: relative;
  height: 80px; /* фиксированная высота для стабильности */
}

.wheel-strip {
  display: flex;
  gap: 14px;
  will-change: transform;
  transition: transform 0.3s ease;
  align-items: center;
  height: 100%;
}

.wheel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  flex-shrink: 0; /* предотвращаем сжатие элементов */
}

.wheel-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.wheel-price {
  margin-top: 4px;
  font-size: 13px;
  color: #e0e7ff;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.wheel-arrow {
  width: 0;
  height: 0;
  margin: auto;
  z-index: 10;
  position: relative;
}

.wheel-arrow-top {
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 14px solid #facc15;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.wheel-arrow-bottom {
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 14px solid #facc15;
  margin-top: 6px;
  margin-bottom: 16px;
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.3));
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.main-spin-btn:hover:not(:disabled) {
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
  transform: translateY(-1px);
}

.main-spin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loader {
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  transition: color 0.2s ease;
}

.show-more:hover {
  color: #facc15;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1e1b4b;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  color: white;
  width: 280px;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
  animation: pop-in 0.3s ease;
  border: 2px solid rgba(250, 204, 21, 0.2);
}

@keyframes pop-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-prize {
  margin: 20px auto;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-price {
  font-size: 20px;
  font-weight: 700;
  color: #facc15;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.modal-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #9333ea;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);
  transition: all 0.2s ease;
}

.modal-button:hover {
  background: #7c3aed;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
}

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