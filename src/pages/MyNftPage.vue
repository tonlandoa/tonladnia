<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

import { user_id, initData } from '@/utils/telegramUser'

const { t } = useI18n()

const nftList = ref<any[]>([])
const loading = ref(true)

const showModal = ref(false)
const selectedNftId = ref<number | null>(null)
const requestId = ref<number | null>(null)
const tonAddress = ref('')
const isWithdrawn = ref(false)

async function fetchMyNFTs() {
    try {
        const response = await axios.post('https://api-backland.com/users/myMft', {
            initData,
            user_id
        })
        nftList.value = response.data.nfts || []
    } catch (error) {
        console.error('Ошибка при загрузке NFT:', error)
    } finally {
        loading.value = false
    }
}

function getImageById(id: number) {
    const imageMap: Record<number, string> = {
        1: '/img/common.png',
        2: '/img/diamond.png',
        3: '/img/epic.png',
        4: '/img/gold.png',
        5: '/img/legendary.png',
        6: '/img/6.png',
        7: '/img/7.png',
        8: '/img/8.png',
        9: '/img/9.png',
        10: '/img/10.png',
        11: '/img/11.png',
        12: '/img/12.png',
        13: '/img/13.png',
        14: '/img/14.png',
        15: '/img/15.png',
        16: '/img/16.jpg',
        17: '/img/17.jpg',
        18: '/img/18.jpg',
        19: '/img/19.jpg',
        20: '/img/20.jpg',
    }

    return imageMap[id] || '/img/11.jpg'
}

function openWithdrawModal(nftId: number, id: number) {
    selectedNftId.value = nftId
    requestId.value = id
    tonAddress.value = ''
    isWithdrawn.value = false
    showModal.value = true
}

async function withdrawNft() {
    if (!tonAddress.value.trim()) {
        alert(t('please_enter_address'))
        return
    }

    try {
        await axios.post('https://api-backland.com/users/outNft', {
            initData,
            user_id,
            requestId: requestId.value,
            tonAddress: tonAddress.value
        })

        // Удаляем NFT по nft_id
        nftList.value = nftList.value.filter(nft => nft.nft_id !== selectedNftId.value)

        isWithdrawn.value = true
    } catch (error) {
        console.error('Ошибка при выводе NFT:', error)
        alert(t('error_try_again'))
    }
}

function closeModal() {
    showModal.value = false
}

function handleOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        closeModal()
    }
}

onMounted(fetchMyNFTs)

</script>

<template>
    <div class="nft-page">
        <h1 class="page-title">{{ t('my_nfts') }}</h1>

        <div v-if="loading" class="loading">{{ t('loading') }}...</div>

        <div v-else-if="nftList.length === 0" class="no-nft">{{ t('no_nfts_yet') }}</div>

        <div class="nft-grid">
            <div class="nft-card" v-for="nft in nftList" :key="nft.id">
                <img :src="getImageById(nft.nft_id)" alt="NFT" class="nft-image" />
                <div class="nft-info">
                    <p class="nft-label">NFT #{{ nft.nft_id }}</p>
                    <button class="withdraw-btn" @click="openWithdrawModal(nft.nft_id, nft.id)">
                        {{ t('withdraw') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
            <div class="modal-content">
                <button class="modal-close" @click="closeModal">✕</button>

                <template v-if="!isWithdrawn">
                    <h2 class="modal-title">{{ t('enter_wallet') }}</h2>
                    <input required v-model="tonAddress" class="wallet-input" :placeholder="t('ton_address')" />
                    <div class="modal-buttons">
                        <button class="modal-btn cancel" @click="closeModal">{{ t('cancel') }}</button>
                        <button class="modal-btn confirm" @click="withdrawNft">{{ t('withdraw') }}</button>
                    </div>
                </template>

                <template v-else>
                    <div class="modal-title">
                        <p class="modal-line">{{ t('nft_will_be_sent', { id: selectedNftId, address: tonAddress }) }}
                        </p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.nft-page {
    padding: 20px;
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    min-height: 100vh;
    font-family: 'Rubik', sans-serif;
}

.page-title {
    text-align: center;
    font-size: 26px;
    font-weight: 800;
    color: #facc15;
    margin-bottom: 30px;
    text-shadow: 1px 1px 3px #000;
}

.loading,
.no-nft {
    text-align: center;
    font-size: 18px;
    margin-top: 60px;
    color: #e0e7ff;
}

.nft-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    padding: 10px 0;
}

.nft-card {
    background: #2e1c52;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
    text-align: center;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nft-image {
    width: 120px;
    height: auto;
    border-radius: 12px;
    margin-bottom: 10px;
    box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
}

.nft-info {
    font-size: 14px;
    color: #e0e7ff;
}

.nft-label {
    font-weight: 600;
    color: #facc15;
    margin-bottom: 4px;
}

.withdraw-btn {
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
    cursor: pointer;
    margin-top: 10px;
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
    padding: 24px 20px 15px;
    width: 90%;
    max-width: 350px;
    text-align: center;
    color: white;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 8px;
    right: 12px;
    background: transparent;
    border: none;
    font-size: 22px;
    color: #9ca3af;
    cursor: pointer;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #facc15;
    white-space: pre-line;
}

.modal-line {
    margin-bottom: 12px;
    color: #facc15;
    font-size: 16px;
    font-weight: 600;
}

.wallet-input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #7c3aed;
    font-size: 16px;
    margin-bottom: 20px;
    outline: none;
    background: #1e1b4b;
    color: white;
    box-sizing: border-box;
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
</style>
