<template>
  <div class="wrapper">
    <div class="card">
      <p>Приложение обновлено, для перехода нажмите кнопку</p>
      <p>The app has been updated. Click the button to continue</p>
      <button @click="openApp">Открыть приложение</button>
    </div>
  </div>
</template>

<script setup lang="ts">
function openApp() {
  window.location.href = "https://t.me/TONlandiaBot/game"
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #6a0dad; /* фиолетовый фон */
  padding: 16px;
}

.card {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.card p {
  margin: 8px 0;
  font-size: 16px;
  color: #333;
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #6a0dad;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #5a00b0;
}
</style>
