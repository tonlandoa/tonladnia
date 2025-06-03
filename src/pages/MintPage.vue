<script setup lang="ts">
import { ref } from 'vue'
import { useTonWallet } from '@/utils/useTonWallet'
import { useI18n } from 'vue-i18n'
import { Wallet, ChevronUp, ChevronDown } from 'lucide-vue-next'

const { isWalletConnected, formattedAddress, onWalletClick } = useTonWallet()
const { t, locale } = useI18n()

const currentLang = ref(locale.value)
const open = ref(false)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'ua', label: 'Українська' }
]

function toggleDropdown() {
  open.value = !open.value
}

function setLang(lang: string) {
  open.value = false
  currentLang.value = lang
  locale.value = lang
}

const nftImages = [
  '/img/common.png',
  '/img/diamond.png',
  '/img/epic.png',
  '/img/gold.png',
  '/img/legendary.png',
]

const revealedNft = ref('')
const nftRevealed = ref(false)
const showConfetti = ref(false)

function revealNft() {
  const random = Math.floor(Math.random() * nftImages.length)
  revealedNft.value = ''
  nftRevealed.value = false

  setTimeout(() => {
    revealedNft.value = nftImages[random]
    nftRevealed.value = true
    showConfetti.value = true

    setTimeout(() => {
      showConfetti.value = false
    }, 4000)
  }, 200)
}
</script>

<template>
  <div class="gift-page">
    <div class="balance-header">
      <button @click="onWalletClick" class="tonconnect-btn">
        <Wallet class="ton-logo" />
        {{ isWalletConnected ? formattedAddress : t('balance.connect_wallet') }}
      </button>

      <div class="language-wrapper">
        <div class="language-menu" @click="toggleDropdown">
          <img :src="`/img/${currentLang}.svg`" class="flag-icon" alt="Lang" />
          <component :is="open ? ChevronUp : ChevronDown" class="arrow-icon" />
        </div>
        <div v-if="open" class="dropdown">
          <div
            v-for="lang in languages"
            :key="lang.code"
            class="dropdown-item"
            @click="setLang(lang.code)"
          >
            <img :src="`/img/${lang.code}.svg`" class="flag-icon" />
            <span>{{ lang.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-block">
      <h1 class="title">{{ $t('get_unique_nft') }}</h1>
      <p class="subtitle">{{ $t('earn_in_season_two') }}</p>
    </div>

    <div class="gift-area">
      <transition name="explode">
        <div v-if="!nftRevealed && !revealedNft" class="gift-box" @click="revealNft">🎁</div>
      </transition>

      <transition name="fade">
        <img
          v-if="nftRevealed && revealedNft"
          :src="revealedNft"
          class="nft-image"
          alt="NFT"
        />
      </transition>
    </div>

    <button class="mint-btn" @click="revealNft">
      {{ $t('mint_nft') }}
    </button>

    <div v-if="showConfetti" class="confetti-wrapper">
      <div v-for="i in 150" :key="i" class="confetti" :style="{ '--i': i }"></div>
    </div>
  </div>
</template>

<style scoped>
.gift-page {
  min-height: 100dvh;
  background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px 80px;
  font-family: 'Rubik', sans-serif;
  position: relative;
}

.balance-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2d1d56;
  border-bottom: 1px solid #3d2d6d;
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
  font-family: 'Inter', sans-serif;
}

.language-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.language-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #2c2f3b;
  background-color: #161c2d;
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
}

.flag-icon {
  width: 24px;
  height: 24px;
}

.arrow-icon {
  width: 18px;
  height: 18px;
}

.text-block {
  text-align: center;
  margin: 80px 0 24px;
}

.title {
  font-size: 26px;
  font-weight: 800;
  color: #facc15;
  margin-bottom: 8px;
  text-shadow: 1px 1px 3px #000;
}

.subtitle {
  font-size: 16px;
  color: #e0e7ff;
}

.gift-area {
  margin: 20px 0;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gift-box {
  font-size: 100px;
  cursor: pointer;
  transition: transform 0.3s;
}

.gift-box:hover {
  transform: scale(1.1);
}

.nft-image {
  width: 180px;
  border-radius: 16px;
  box-shadow: 0 0 15px rgba(250, 204, 21, 0.5);
  animation: popIn 0.5s ease-out;
}

.mint-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #7c3aed, #c084fc);
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s ease;
  z-index: 100;
}

.mint-btn:hover {
  transform: translate(-50%, -2px);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.explode-enter-active {
  animation: explode 0.5s ease-in-out;
}

@keyframes explode {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3) rotate(15deg);
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.confetti-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 20;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: hsl(calc(3.6 * var(--i)), 80%, 60%);
  top: -10px;
  left: calc(1% * var(--i));
  border-radius: 50%;
  animation: fall 4s linear infinite;
  opacity: 0.9;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(720deg);
  }
}
</style>
