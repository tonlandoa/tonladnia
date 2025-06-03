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

function resetNft() {
    revealedNft.value = ''
    nftRevealed.value = false
}

function revealNft() {
    if (nftRevealed.value) return

    const giftBox = document.querySelector('.gift-box')
    giftBox?.classList.add('shake')

    setTimeout(() => {
        giftBox?.classList.remove('shake')

        const random = Math.floor(Math.random() * nftImages.length)
        revealedNft.value = nftImages[random]
        nftRevealed.value = true
        showConfetti.value = true

        // Скрыть NFT и вернуть подарок через 5 секунд
        setTimeout(() => {
            showConfetti.value = false
            resetNft()
        }, 5000)
    }, 800)
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
                    <div v-for="lang in languages" :key="lang.code" class="dropdown-item" @click="setLang(lang.code)">
                        <img :src="`/img/${lang.code}.svg`" class="flag-icon" />
                        <span>{{ lang.label }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="text-block">
                <h1 class="title">{{ $t('get_unique_nft') }}</h1>
                <p class="subtitle">{{ $t('earn_in_season_two') }}</p>
            </div>

            <div class="gift-area">
                <transition name="explode">
                    <div v-if="!nftRevealed" class="gift-box">
                        🎁
                    </div>
                </transition>

                <transition name="nft-reveal">
                    <img v-if="revealedNft" :src="revealedNft" class="nft-image" alt="NFT" />
                </transition>
            </div>

            <button class="mint-btn" @click="revealNft">
                {{ nftRevealed ? $t('open_again') : $t('mint_nft') }}
            </button>
        </div>

        <div v-if="showConfetti" class="confetti-wrapper">
            <div v-for="i in 200" :key="i" class="confetti" :style="{
                '--i': i,
                '--x': Math.random() * 100,
                '--delay': Math.random() * 3,
                '--duration': 3 + Math.random() * 2,
                '--size': 6 + Math.random() * 6
            }"></div>
        </div>
    </div>
</template>
<style scoped>
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

.gift-page {
    min-height: 100dvh;
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
    font-family: 'Rubik', sans-serif;
}

.content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
    /* Для header */
    padding-bottom: 80px;
    /* Для кнопки */
}

.text-block {
    text-align: center;
    margin-bottom: 24px;
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
    position: relative;
}

.gift-box {
    font-size: 100px;
    cursor: pointer;
    transition: all 0.3s;
    transform-origin: center;
}

.gift-box:hover {
    transform: scale(1.05);
}

.shake {
    animation: shake 0.8s cubic-bezier(.36, .07, .19, .97) both;
}

.nft-image {
    width: 180px;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.5);
}

.mint-btn {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #7c3aed, #c084fc);
    color: white;
    padding: 16px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    width: calc(100% - 40px);
    max-width: 300px;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.mint-btn:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6);
}

.mint-btn:active {
    transform: translateX(-50%) translateY(1px);
}

/* Анимация конфетти */
.confetti-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 100;
}

.confetti {
    position: absolute;
    width: calc(var(--size) * 1px);
    height: calc(var(--size) * 1px);
    background-color: hsl(calc(var(--i) * 3.6), 90%, 60%);
    top: -10px;
    left: calc(var(--x) * 1%);
    animation: fall linear infinite;
    animation-duration: calc(var(--duration) * 1s);
    animation-delay: calc(var(--delay) * 1s);
    opacity: 0.8;
    border-radius: 50%;
}

.confetti:nth-child(odd) {
    background-color: hsl(calc(var(--i) * 3.6), 90%, 70%);
}

.confetti:nth-child(3n) {
    border-radius: 0;
}

.confetti:nth-child(5n) {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

@keyframes fall {
    0% {
        transform: translateY(0) rotate(0deg) translateX(0);
    }

    100% {
        transform: translateY(100vh) rotate(720deg) translateX(calc((var(--i) - 50) * 0.5px));
    }
}

/* Анимации */
.nft-reveal-enter-active {
    animation: nftReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.nft-reveal-leave-active {
    animation: nftReveal 0.5s reverse;
}

@keyframes nftReveal {
    0% {
        transform: scale(0.5) rotate(-30deg);
        opacity: 0;
    }

    70% {
        transform: scale(1.1) rotate(10deg);
    }

    100% {
        transform: scale(1) rotate(0);
        opacity: 1;
    }
}

.explode-enter-active {
    animation: explode 0.5s ease-in-out both;
}

@keyframes explode {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2) rotate(15deg);
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

@keyframes shake {
    0% {
        transform: translateX(0) rotate(0);
    }

    15% {
        transform: translateX(-10px) rotate(-5deg);
    }

    30% {
        transform: translateX(8px) rotate(4deg);
    }

    45% {
        transform: translateX(-6px) rotate(-3deg);
    }

    60% {
        transform: translateX(4px) rotate(2deg);
    }

    75% {
        transform: translateX(-2px) rotate(-1deg);
    }

    100% {
        transform: translateX(0) rotate(0);
    }
}
</style>