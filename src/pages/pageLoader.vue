<template>
    <div v-if="isLoading" class="loader-container">
        <img src="/img/pepafinal.png" alt="Loading..." class="loader-img" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isLoading = ref(false);

const withLoader = async (callback: () => Promise<void>) => {
    try {
        isLoading.value = true;
        await callback();
    } finally {
        isLoading.value = false;
    }
};

defineExpose({
    isLoading,
    withLoader,
});
</script>


<style scoped>
.loader-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;

    background: linear-gradient(to bottom, #3c1e62, #1e1b4b);
    display: flex;
    align-items: center;
    justify-content: center;
}

.loader-img {
    width: 100px;
    height: auto;
    animation: jump 1s infinite;
}

@keyframes jump {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}
</style>
