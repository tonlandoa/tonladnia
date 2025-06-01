<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  Wallet,
  StickyNote,
  ClipboardCopy,
  Send,
  Coins,
  ChevronUp,
  ChevronDown,
  Check
} from 'lucide-vue-next'

import axios from 'axios'

import { useTonWallet } from '@/utils/useTonWallet'
import { tonConnectUI } from '@/utils/tonconnect'

const { isWalletConnected, formattedAddress, onWalletClick } = useTonWallet()

import {
  startParam,
  photo_url,
  initData,
  tg,
  user_id,
  username,
  language_code
} from '@/utils/telegramUser'


import api from '@/utils/api'
import PageLoader from './pageLoader.vue'

const loaderRef = ref<InstanceType<typeof PageLoader> | null>(null)

const balanceTon = ref('0')
const balancePaymentsTon = ref('0')

const getUser = async () => {
  await loaderRef.value?.withLoader(async () => {
    const response = await api.post('/users/getUser', {
      initData,
      user_id,
      username,
      language_code,
      photo_url,
      startParam
    })

    const user = response.data
    balanceTon.value = user.balance_ton ?? '0'
    balancePaymentsTon.value = user.balance_payments_ton ?? '0'
  })
}

const activeTab = ref<'deposit' | 'withdraw'>('deposit')
const amount = ref('')
const walletAddress = ref('')
const showSuccessModal = ref(false)

const fullAddress = 'UQCHE8O8fz6VuoohJxfGrp8xGgItdQutHS5ptRwM2sZAdwsf'
const fullMemo = String(user_id ?? '')
const shortAddress = fullAddress.slice(0, 6) + '...' + fullAddress.slice(-6)

const formLoaders = reactive({
  depositTon: false,
  withdrawalTon: false
})

const copied = ref({ address: false, memo: false })

function copyToClipboard(text: string, field: 'address' | 'memo') {
  navigator.clipboard.writeText(text).then(() => {
    copied.value[field] = true
    setTimeout(() => {
      copied.value[field] = false
    }, 1500)
  })
}

const withdrawalFormTon = async () => {
  return await api.post('/users/withdrawalTon', {
    initData,
    user_id,
    wallet_withdrawal: walletAddress.value,
    sum_withdrawal: amount.value,
  });
};

async function handleSubmit() {
  if (activeTab.value === 'deposit') {
    formLoaders.depositTon = true

    if (!isWalletConnected.value) {
      await onWalletClick()
      formLoaders.depositTon = false
      return;
    }
    try {
      const { data } = await axios.get(`https://www.api-nodeland.com/api/getMemo?comment=${user_id}`)

      if (data.comment) {
        const tonAmount = parseFloat(amount.value)
        const amountNano = (tonAmount * 1e9).toString()

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: 'UQCHE8O8fz6VuoohJxfGrp8xGgItdQutHS5ptRwM2sZAdwsf',
              amount: amountNano,
              payload: data.comment
            }
          ]
        }

        await tonConnectUI.sendTransaction(transaction)
      } else {
        tg.showAlert('Deposit error. Please contact the administrator or make a manual transfer.')
      }
    } catch {
      tg.showAlert('The deposit has been canceled.')
    } finally {
      formLoaders.depositTon = false
    }
  } else {
    try {
      formLoaders.depositTon = true
      const res = await withdrawalFormTon();

      if (res.data.status == 1) {
        const sum = parseFloat(amount.value || '0');
        const current_withdrawal_ton = parseFloat(balancePaymentsTon.value || '0');

        const total = (!isNaN(sum) ? sum : 0) + (!isNaN(current_withdrawal_ton) ? current_withdrawal_ton : 0);
        balancePaymentsTon.value = total.toFixed(2);

        showSuccessModal.value = true
      } else {
        tg.showAlert("Not enough TON in balance.");
      }
    } catch {
      tg.showAlert('WithdrawalFormTon error. Please contact the administrator or make a manual transfer.')
    } finally {
      formLoaders.depositTon = false
    }


  }
}

import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
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

onMounted(() => {
  getUser()
})
</script>

<template>
  <PageLoader ref="loaderRef" />
  <div class="balance-page">
    <div class="balance-header">
      <button @click="onWalletClick" class="tonconnect-btn">
        <Wallet class="ton-logo" />
        {{ isWalletConnected ? formattedAddress : 'Connect Wallet' }}
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

    <div class="balance-section">
      <div class="balance-card">
        <div class="balance-label">Баланс</div>
        <div class="balance-info">
          <Coins class="ton-icon" />
          <span>{{ balanceTon }} TON</span>
        </div>
      </div>
      <div class="balance-card">
        <div class="balance-label">Доступно к выводу</div>
        <div class="balance-info">
          <Coins class="ton-icon" />
          <span>{{ balancePaymentsTon }} TON</span>
        </div>
      </div>
    </div>

    <div class="tabs">
      <div :class="['tab', activeTab === 'deposit' && 'active']" @click="activeTab = 'deposit'">Пополнение</div>
      <div :class="['tab', activeTab === 'withdraw' && 'active']" @click="activeTab = 'withdraw'">Вывод</div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div v-if="activeTab === 'withdraw'" class="input-row">
        <label class="input-label">TON-кошелёк</label>
        <div class="input-wrap">
          <Send class="icon-left" />
          <input v-model="walletAddress" type="text" placeholder="Введите TON адрес" required />
        </div>
      </div>

      <div class="input-row">
        <label class="input-label">Сумма</label>
        <div class="input-wrap">
          <Wallet class="icon-left" />
          <input v-model="amount" required type="number" placeholder="0.1" step="0.1" min="0.1" />
          <span class="suffix">TON</span>
        </div>
      </div>

      <button :disabled="formLoaders.depositTon" type="submit" class="main-btn">
        <template v-if="formLoaders.depositTon">
          <span class="spinner" />
        </template>
        <template v-else>
          {{ activeTab === 'deposit' ? 'Пополнить баланс' : 'Вывести баланс' }}
        </template>
      </button>
    </form>

    <div class="divider">или</div>

    <div class="manual">
      <h3 class="manual-title">Отправить TON вручную</h3>
      <p class="warn-text">
        При переводе обязательно укажите <span class="red">MEMO</span>
      </p>

      <div class="field">
        <label>Адрес</label>
        <div class="field-box">
          <Wallet class="icon-left" />
          <span class="field-value">{{ shortAddress }}</span>
          <ClipboardCopy v-if="!copied.address" class="copy-icon" @click="copyToClipboard(fullAddress, 'address')" />
          <Check v-else class="copy-icon" />
        </div>
      </div>

      <div class="field">
        <label>Memo</label>
        <div class="field-box">
          <StickyNote class="icon-left" />
          <span class="field-value">{{ fullMemo }}</span>
          <ClipboardCopy v-if="!copied.memo" class="copy-icon" @click="copyToClipboard(fullMemo, 'memo')" />
          <Check v-else class="copy-icon" />
        </div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal-content">
        <h2 class="modal-title">Успешно</h2>
        <p class="modal-text">TON успешно отправлены на Ваш кошелёк</p>
        <div class="modal-buttons">
          <button class="modal-btn confirm" @click="showSuccessModal = false">OK</button>
        </div>
      </div>
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


.balance-page {
  background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
  min-height: 100dvh;
  color: white;
  padding: 100px 20px 40px;
  font-family: 'Rubik', sans-serif;
  max-width: 420px;
  margin: auto;

  padding-bottom: 100px;
}

.balance-section {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.balance-card {
  flex: 1;
  background: #1f1b35;
  border: 1px solid #3f3c5a;
  border-radius: 14px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50px;
}

.balance-label {
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 14px;
  margin-top: 6px;
  color: white;
}

.ton-icon {
  width: 16px;
  height: 16px;
  color: #facc15;
}

.tabs {
  display: flex;
  background: #1e1b32;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  background: #1e1b32;
  transition: 0.2s;
}

.tab.active {
  background: #9333ea;
}

.input-row {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: #1f1b35;
  border: 1px solid #4b3c72;
  border-radius: 12px;
  overflow: hidden;
}

.input-wrap input {
  background: transparent;
  border: none;
  padding: 12px;
  color: white;
  font-size: 16px;
  flex: 1;
}

.input-wrap input:focus {
  outline: none;
}

.suffix {
  padding: 12px;
  font-weight: 600;
  background: #26203e;
  border-left: 1px solid #4b3c72;
}

.icon-left {
  width: 16px;
  height: 16px;
  margin-left: 12px;
  margin-right: 8px;
  color: #c084fc;
}

.main-btn {
  background: linear-gradient(to right, #7c3aed, #a855f7);
  color: white;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  margin-bottom: 24px;
  cursor: pointer;
}

.divider {
  text-align: center;
  color: #94a3b8;
  margin-bottom: 16px;
  font-weight: 500;
}

.manual {
  background: #1e1b32;
  border-radius: 16px;
  padding: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.manual-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 1px;
}

.warn-text {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: #f87171;
}

.red {
  color: #ef4444;
  font-weight: 600;
}

.field {
  margin-bottom: 14px;
}

.field label {
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
  color: #d1d5db;
}

.field-box {
  display: flex;
  align-items: center;
  background: #1f1b35;
  border: 1px solid #4b3c72;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.field-value {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.copy-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #c084fc;
  cursor: pointer;
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
  padding: 24px;
  padding-top: 5px;
  padding-bottom: 15px;
  width: 90%;
  max-width: 320px;
  text-align: center;
  color: white;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #facc15;
}

.modal-text {
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.4;
}

.modal-buttons {
  display: flex;
  justify-content: center;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
  color: white;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
}
</style>
