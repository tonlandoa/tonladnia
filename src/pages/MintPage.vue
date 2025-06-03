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
const isAnimating = ref(false)

function startReveal() {
    if (isAnimating.value) return
    
    isAnimating.value = true
    nftRevealed.value = false
    revealedNft.value = ''
    
    // Анимация встряхивания подарка
    const giftBox = document.querySelector('.gift-box')
    giftBox?.classList.add('shake')
    
    setTimeout(() => {
        giftBox?.classList.remove('shake')
        
        // Показываем NFT
        const random = Math.floor(Math.random() * nftImages.length)
        revealedNft.value = nftImages[random]
        nftRevealed.value = true
        showConfetti.value = true
        
        // Через 3.5 секунды скрываем NFT и показываем подарок снова
        setTimeout(() => {
            showConfetti.value = false
            nftRevealed.value = false
            isAnimating.value = false
        }, 3500)
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
                <transition name="fade" mode="out-in">
                    <div v-if="!nftRevealed" class="gift-box">
                        🎁
                    </div>
                    <img v-else :src="revealedNft" class="nft-image" alt="NFT" />
                </transition>
            </div>

            <button 
                class="mint-btn" 
                @click="startReveal"
                :disabled="isAnimating"
            >
                {{ $t('mint_nft') }}
                <span v-if="isAnimating" class="loading-dots"></span>
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
/* Все предыдущие стили остаются такими же, добавляем только новые/измененные */

.gift-box {
    font-size: 100px;
    cursor: default; /* Убираем курсор, так как клик теперь на кнопке */
    transition: all 0.3s;
    transform-origin: center;
}

.shake {
    animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.mint-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateX(-50%) scale(0.98);
}

.loading-dots {
    display: inline-flex;
    align-items: center;
    height: 20px;
}
.loading-dots::after {
    content: '...';
    animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
}

@keyframes shake {
    0% { transform: translateX(0) rotate(0); }
    15% { transform: translateX(-10px) rotate(-5deg); }
    30% { transform: translateX(8px) rotate(4deg); }
    45% { transform: translateX(-6px) rotate(-3deg); }
    60% { transform: translateX(4px) rotate(2deg); }
    75% { transform: translateX(-2px) rotate(-1deg); }
    100% { transform: translateX(0) rotate(0); }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>