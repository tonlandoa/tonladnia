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
const tonAddress = ref('')

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
    const images = [
        '/img/common.png',
        '/img/diamond.png',
        '/img/epic.png',
        '/img/gold.png',
        '/img/legendary.png'
    ]
    return images[id - 1] || images[0]
}

function openWithdrawModal(nftId: number) {
    selectedNftId.value = nftId
    tonAddress.value = ''
    showModal.value = true
}

function withdrawNft() {
    if (!tonAddress.value) {
        alert('Введите TON-кошелёк')
        return
    }
    alert(`Заработает через несколько минут ${tonAddress.value}`)
    showModal.value = false
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
                    <button class="withdraw-btn" @click="openWithdrawModal(nft.nft_id)">
                        {{ t('withdraw') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">Введите TON-кошелёк</h2>
                <input
                    v-model="tonAddress"
                    class="wallet-input"
                    placeholder="TON адрес"
                />
                <button class="withdraw-btn" @click="withdrawNft">Вывести</button>
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #1e1b4b;
    padding: 30px 20px;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    text-align: center;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #facc15;
    margin-bottom: 20px;
}

.wallet-input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #7c3aed;
    font-size: 16px;
    margin-bottom: 20px;
    outline: none;
}
</style>
