<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

import { useI18n } from 'vue-i18n'

import { user_id, initData } from '@/utils/telegramUser'


const { t } = useI18n()

const nftList = ref<any[]>([])
const loading = ref(true)

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
                 
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
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
</script>

<style scoped>
.nft-page {
    padding: 20px;
    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    color: white;
    min-height: 100vh;
    font-family: 'Rubik', sans-serif;
}

.balance-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
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
    transition: background 0.2s;
}

.ton-logo {
    width: 20px;
    height: 20px;
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

.nft-date {
    font-size: 12px;
    opacity: 0.8;
}
</style>
