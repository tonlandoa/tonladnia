<script setup lang="ts">
import { useTonWallet } from '@/utils/useTonWallet'
const { isWalletConnected, formattedAddress, onWalletClick } = useTonWallet()


import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  ClipboardCopy,
  Check,
  ChevronUp,
  ChevronDown,
  Users,
  User,
  Wallet,
  Gift,
} from 'lucide-vue-next'

import axios from 'axios'
import PageLoader from './pageLoader.vue'
import {
  initData,
  tg,
  user_id,
} from '@/utils/telegramUser'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

import api from '@/utils/api'
import type { ReferralFromApi } from '../types/api.types'

const loaderRef = ref<InstanceType<typeof PageLoader> | null>(null)

const formLoaders = reactive({
  getRefferalMsg: false,
})

async function getRefferalMessage() {
  formLoaders.getRefferalMsg = true
  try {
    const { data } = await axios.get('https://www.api-nodeland.com/api/getRefferal?userId=' + user_id)
    tg.shareMessage(data.data.id)
  } catch (e) {
    alert(e)
  } finally {
    formLoaders.getRefferalMsg = false
  }
}

const refLink = `https://t.me/TONlandiaBot/game?startapp=${user_id}`
const copied = ref(false)

function copyReferral() {
  navigator.clipboard.writeText(refLink).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  })
}

const activeLevel = ref(1)


const currentLang = ref(locale.value)
const open = ref(false)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'ua', label: 'Українська' },
]

function toggleDropdown() {
  open.value = !open.value
}

function setLang(lang: string) {
  open.value = false
  currentLang.value = lang
  locale.value = lang
}

const loadedLevels = ref<{ [key: string]: boolean }>({
  level1: false,
  level2: false,
  level3: false,
})

const referrals = ref([
  { count: 0, refs: [] as any[] },
  { count: 0, refs: [] as any[] },
  { count: 0, refs: [] as any[] },
])

const getUser = async () => {
  await loaderRef.value?.withLoader(async () => {
    const response = await api.post('/users/getUser', {
      initData,
      user_id,
    })

    const data = response.data

    referrals.value[0].count = data.referral_count_level1 || 0
    referrals.value[1].count = data.referral_count_level2 || 0
    referrals.value[2].count = data.referral_count_level3 || 0
  })
}

const getUserReferral = async (level: 'level1' | 'level2' | 'level3') => {
  if (loadedLevels.value[level]) return

  await loaderRef.value?.withLoader(async () => {
    const { data } = await api.post('/users/getRefferal', {
      user_id,
      initData,
      level: parseInt(level.replace('level', '')),
    })

    const refs = (data as ReferralFromApi[]).map((item) => ({
      id: item.user_id,
      name: item.login || 'No Name',
      amount: String(item.deposit_ton || '0'),
    }))

    const index = parseInt(level.replace('level', '')) - 1
    referrals.value[index].refs = refs
    loadedLevels.value[level] = true
  })
}

const getActiveLevelRefs = computed(() => referrals.value[activeLevel.value - 1].refs)

watch(activeLevel, (tab) => {
  getUserReferral(`level${tab}` as 'level1' | 'level2' | 'level3')
})

onMounted(() => {
  getUserReferral('level1')
  getUser()
})
</script>


<template>
  <PageLoader ref="loaderRef" />
  <div class="friends-page">
    <div class="balance-header">
      <button @click="onWalletClick" class="tonconnect-btn">
        <Wallet class="ton-logo" />
        {{ isWalletConnected ? formattedAddress : t('friends.connect_wallet') }}
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

    <h1 class="page-title">{{ t('friends.title') }}</h1>

    <div class="invite-block">
      <p class="invite-title" v-html="t('friends.invite_title_html')" />
      <div class="invite-row">
        <Gift class="icon-left" />
        <input type="text" class="invite-input" readonly :value="refLink" />
        <ClipboardCopy v-if="!copied" class="copy-icon" @click="copyReferral" />
        <Check v-else class="copy-icon success" />
      </div>
      <button :disabled="formLoaders.getRefferalMsg" @click="getRefferalMessage" class="main-btn">
        <template v-if="formLoaders.getRefferalMsg">
          <span class="spinner" />
        </template>
        <template v-else>
          {{ t('friends.invite_btn') }}
        </template>
      </button>
    </div>

    <h2 class="section-title">{{ t('friends.stats_title') }}</h2>
    <div class="levels-summary">
      <div class="level-card" v-for="level in 3" :key="level">
        <div class="level-label">
          {{ t('friends.level', { level }) }}
        </div>
        <div class="level-count">
          <Users class="level-icon" /> {{ referrals[level - 1].count }}
        </div>
      </div>
    </div>

    <div class="level-tabs">
      <div class="tab" :class="{ active: activeLevel === level }" v-for="level in [1, 2, 3]" :key="level"
        @click="activeLevel = level">
        {{ t('friends.level', { level }) }}
      </div>
    </div>

    <div class="referral-list">
      <div v-for="(ref, index) in getActiveLevelRefs" :key="index" class="referral-item">
        <div class="referral-name">
          <User class="ref-icon" />
          {{ ref.name }}
        </div>
        <span class="referral-amount">{{ ref.amount }} TON</span>
      </div>
      <p v-if="getActiveLevelRefs.length === 0" class="no-data">{{ t('friends.no_referrals') }}</p>
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

.friends-page {
  background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
  min-height: 100dvh;
  padding: 90px 16px 100px;
  color: white;
  max-width: 420px;
  margin: auto;
  font-family: 'Rubik', sans-serif;
}

.page-title {
  font-size: 26px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 20px;
}

.invite-block {
  background: #1e1b32;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

.invite-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 14px;
}

.highlight {
  color: #facc15;
}

.highlight-blue {
  color: #38bdf8;
}

.invite-row {
  display: flex;
  align-items: center;
  background: #161c2d;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 12px;
}

.icon-left {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: #facc15;
}

.invite-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.invite-input:focus {
  outline: none;
}

.copy-icon {
  width: 18px;
  height: 18px;
  color: #c084fc;
  cursor: pointer;
  transition: color 0.3s;
}

.copy-icon.success {
  color: #22c55e;
}

.main-btn {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: box-shadow 0.2s, transform 0.2s;
}

.main-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
  text-align: center;
  color: #facc15;
}

.levels-summary {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 20px;
}

.level-card {
  flex: 1;
  background: #1e1b32;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  border: 1px solid #334155;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.02);
}

.level-label {
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
}

.level-icon {
  width: 16px;
  height: 16px;
  color: #facc15;
}

.level-count {
  font-size: 14px;
  font-weight: 700;
  color: white;
  align-items: center;
  display: flex;
  justify-content: center;
}

.level-tabs {
  display: flex;
  justify-content: space-around;
  background: #1e1b32;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  color: #94a3b8;
  transition: background 0.2s, color 0.2s;
}

.tab.active {
  background: #9333ea;
  color: white;
}

.referral-list {
  background: #1e1b32;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.05);
}

.referral-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #334155;
}

.referral-item:last-child {
  border-bottom: none;
}

.referral-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ref-icon {
  width: 16px;
  height: 16px;
  color: #facc15;
}

.referral-amount {
  font-weight: 600;
  color: #38bdf8;
}

.no-data {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  padding: 12px 0;
}
</style>
