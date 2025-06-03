<template>
    <div class="gift-page">
        <div class="text-block">
            <h1 class="title">{{ $t('get_unique_nft') }}</h1>
            <p class="subtitle">{{ $t('earn_in_season_two') }}</p>
        </div>

        <div class="gift-area">
            <transition name="explode">
                <div v-if="!nftRevealed" class="gift-box" @click="revealNft">
                    🎁
                </div>
            </transition>

            <transition name="fade">
                <img v-if="nftRevealed" :src="revealedNft" class="nft-image" alt="NFT" />
            </transition>
        </div>

        <button class="mint-btn" v-if="!nftRevealed" @click="revealNft">
            {{ $t('mint_nft') }}
        </button>

        <div v-if="showConfetti" class="confetti-wrapper">
            <div v-for="i in 100" :key="i" class="confetti"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
    if (nftRevealed.value) return

    const random = Math.floor(Math.random() * nftImages.length)
    revealedNft.value = nftImages[random]
    nftRevealed.value = true
    showConfetti.value = true

    // Отключить конфетти через 3 секунды
    setTimeout(() => {
        showConfetti.value = false
    }, 3000)
}
</script>

<style scoped>
.gift-page {
    min-height: 100dvh;
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    font-family: 'Rubik', sans-serif;
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
}

.gift-box {
    font-size: 100px;
    cursor: pointer;
    transition: transform 0.3s;
}

.gift-box:hover {
    transform: scale(1.05);
}

.nft-image {
    width: 180px;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.5);
    transition: transform 0.4s;
}

.mint-btn {
    background: linear-gradient(135deg, #7c3aed, #c084fc);
    color: white;
    padding: 12px 18px;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    margin-top: 16px;
    transition: 0.2s ease;
}

.mint-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
}

/* Анимация конфетти */
.confetti-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: hsl(var(--hue), 70%, 60%);
    top: -10px;
    animation: fall 3s linear infinite;
    opacity: 0.8;
    border-radius: 50%;
    --hue: calc(360 * var(--i) / 100);
    left: calc(100% * var(--i) / 100);
}

.confetti:nth-child(n) {
    --i: 1;
}

.confetti:nth-child(2n) {
    --i: 2;
}

.confetti:nth-child(3n) {
    --i: 3;
}

/* up to 100 */

@keyframes fall {
    to {
        transform: translateY(100vh) rotate(720deg);
    }
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.explode-enter-active {
    animation: explode 0.4s ease-in-out;
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
</style>
