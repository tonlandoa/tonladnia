import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

import './style.css'

import ru from './locales/ru.json'
import en from './locales/en.json'
import ua from './locales/ua.json'

const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'en',
    messages: {
        ru,
        en,
        ua
    }
})

createApp(App).use(router).use(i18n).mount('#app')
