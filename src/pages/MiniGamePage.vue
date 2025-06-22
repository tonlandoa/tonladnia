<script setup lang="ts">
import { Swords, Heart, Zap, Star, Shield } from 'lucide-vue-next'

const playerCards = [
    { name: 'GOLD', image: '7.png', rarity: 'Legendary', color: '#facc15', attack: 90 },
    { name: 'COMMON', image: '10.png', rarity: 'Epic', color: '#ef4444', attack: 75 },
    { name: 'EPIC', image: '9.png', rarity: 'Rare', color: '#f59e0b', attack: 60 },
]

const enemyCards = [
    { name: 'LEGENDARY', image: '8.png', rarity: 'Epic', color: '#60a5fa', attack: 72 },
    { name: 'DIAMOND', image: '9.png', rarity: 'Epic', color: '#ef4444', attack: 68 },
    { name: 'EPIC', image: 'common.png', rarity: 'Common', color: '#a78bfa', attack: 50 },
]
</script>

<template>
    <div class="pvp-page">
        <!-- Верхний игрок -->
        <div class="player-header enemy">
            <div class="player-info">
                <div class="avatar-wrapper">
                    <img src="/img/floki.png" class="avatar" />
                    <div class="level-badge">Lv.42</div>
                </div>
                <div class="name-wrapper">
                    <div class="name">Enemy</div>
                    <div class="status">
                        <Zap class="icon" />
                        <span>Online</span>
                    </div>
                </div>
            </div>
            <div class="player-health">
               
                <div class="health-value">
                    <Heart class="icon" /> 100 HP
                </div>
            </div>
        </div>

        <!-- Карты противника -->
        <div class="cards-row enemy-cards">
            <div v-for="card in enemyCards" :key="card.name" class="card" :style="{ '--card-color': card.color }">
                <div class="card-rarity" :class="card.rarity.toLowerCase()">
                    <Star class="icon" v-if="card.rarity === 'Legendary'" />
                    <Shield class="icon" v-else-if="card.rarity === 'Epic'" />
                    <span v-else>{{ card.rarity }}</span>
                </div>
                <div class="card-image-wrapper">
                    <img :src="'/img/' + card.image" class="card-img" />
                </div>
                <div class="card-title">{{ card.name }}</div>
                <div class="card-stats">
                    <div class="card-attack">
                        <Swords class="icon" /> {{ card.attack }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Поле -->
        <div class="battlefield">
            <div class="vs-circle">
                <div class="vs-text">VS</div>
            </div>
        </div>

        <!-- Карты игрока -->
        <div class="cards-row player-cards">
            <div v-for="card in playerCards" :key="card.name" class="card" :style="{ '--card-color': card.color }">
                <div class="card-rarity" :class="card.rarity.toLowerCase()">
                    <Star class="icon" v-if="card.rarity === 'Legendary'" />
                    <Shield class="icon" v-else-if="card.rarity === 'Epic'" />
                    <span v-else>{{ card.rarity }}</span>
                </div>
                <div class="card-image-wrapper">
                    <img :src="'/img/' + card.image" class="card-img" />
                </div>
                <div class="card-title">{{ card.name }}</div>
                <div class="card-stats">
                    <div class="card-attack">
                        <Swords class="icon" /> {{ card.attack }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Нижний игрок -->
        <div class="player-header player">
            <div class="player-info">
                <div class="avatar-wrapper">
                    <img src="/img/doge.png" class="avatar" />
                    <div class="level-badge">Lv.37</div>
                </div>
                <div class="name-wrapper">
                    <div class="name">You</div>
                    <div class="status">
                        <Zap class="icon" />
                        <span>Online</span>
                    </div>
                </div>
            </div>
            <div class="player-health">
              
                <div class="health-value">
                    <Heart class="icon" /> 100 HP
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

.pvp-page {
    background: linear-gradient(to bottom, #1a133a, #2e1a47);
    min-height: 100vh;
    color: white;
    font-family: 'Rubik', sans-serif;
    max-width: 480px;
    margin: auto;
    padding: 20px 12px 40px;
    position: relative;
    overflow: hidden;
}

.pvp-page::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
    pointer-events: none;
}

.player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    margin: 14px 0;
    position: relative;
    z-index: 2;
}

.player-header.enemy {
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.3);
}

.player-header.player {
    background: rgba(250, 204, 21, 0.1);
    border: 1px solid rgba(250, 204, 21, 0.3);
}

.player-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-wrapper {
    position: relative;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #a78bfa;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.level-badge {
    position: absolute;
    bottom: -6px;
    right: -6px;
    background: #9333ea;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid #a78bfa;
}

.name-wrapper {
    display: flex;
    flex-direction: column;
}

.name {
    font-weight: 700;
    font-size: 16px;
}

.status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #4ade80;
    margin-top: 2px;
}

.status .icon {
    color: #4ade80;
}

.player-health {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
}

.health-bar {
    width: 120px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.player-header.enemy .health-fill {
    background: linear-gradient(to right, #60a5fa, #3b82f6);
}

.player-header.player .health-fill {
    background: linear-gradient(to right, #facc15, #f59e0b);
}

.health-value {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 6px;
    font-weight: 600;
}

.player-header.enemy .health-value {
    color: #60a5fa;
}

.player-header.player .health-value {
    color: #facc15;
}

.cards-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.enemy-cards {
    margin-bottom: 40px;
}

.player-cards {
    margin-top: 40px;
}

.card {
    background: #1f1b35;
    border-radius: 16px;
    padding: 8px;
    width: 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
    border: 1px solid var(--card-color);
}

.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--card-color);
}

.card:hover {
    transform: translateY(-5px);
}

.card-rarity {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.card-rarity.common {
    background: rgba(167, 139, 250, 0.2);
    color: #a78bfa;
    border: 1px solid #a78bfa;
}

.card-rarity.rare {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    border: 1px solid #f59e0b;
}

.card-rarity.epic {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
}

.card-rarity.legendary {
    background: rgba(250, 204, 21, 0.2);
    color: #facc15;
    border: 1px solid #facc15;
}

.card-image-wrapper {
    width: 84px;
    height: 84px;
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
}

.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-title {
    font-weight: 600;
    margin-top: 8px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-stats {
    margin-top: 8px;
}

.card-attack {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #facc15;
    gap: 4px;
    font-weight: 600;
}

.battlefield {
    position: relative;
    height: 60px;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.vs-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(147, 51, 234, 0.2);
    border: 2px solid #9333ea;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
}

.vs-text {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: #9333ea;
    text-shadow: 0 0 8px rgba(147, 51, 234, 0.5);
}

.battlefield::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #9333ea, transparent);
    transform: translateY(-50%);
}
</style>