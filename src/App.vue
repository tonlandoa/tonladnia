<template>

  <router-view />

  <nav class="bottom-nav">
    <router-link v-for="item in menuItems" :key="item.to" :to="item.to" class="nav-item" active-class="active">
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>

</template>

<script setup lang="ts">
import {
  Home,
  Wallet,
  Users,
  Table,
  Image
} from 'lucide-vue-next'



import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#2d1d56');
tg.disableVerticalSwipes();

function onHapticTap(e: MouseEvent | TouchEvent) {
  const target = e.target as HTMLElement
  if (target.closest('a, button')) {
    tg.HapticFeedback.impactOccurred('medium');
  }
}

onMounted(() => {

  document.addEventListener('click', onHapticTap);
})

onBeforeUnmount(() => {

  document.removeEventListener('click', onHapticTap);
})


const menuItems = computed(() => [
  { to: '/', label: t('nav.home'), icon: Home },
  { to: '/balance', label: t('nav.balance'), icon: Wallet },
  { to: '/my_nft', label: t('nav.nft'), icon: image },
  { to: '/friends', label: t('nav.friends'), icon: Users },
  { to: '/tasks', label: t('nav.tasks'), icon: Table },
])
</script>


<style scoped>
.bottom-nav {
  padding-bottom: 12px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(160deg, #3b1f8b, #1e0c4a);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.3);
}

.nav-item {
  color: #bbb;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #fff;
}

.nav-icon {
  width: 22px;
  height: 22px;
  margin-bottom: 4px;
}

.nav-item.active {
  color: #fff;
  font-weight: bold;
}

.nav-item.active .nav-icon {
  stroke: #facc15;
}
</style>
