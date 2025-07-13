// src/utils/telegramUser.ts

export const tg = window.Telegram?.WebApp;

// данные пользователя
export const initData = tg?.initData;
export const user = tg?.initDataUnsafe?.user;

export const user_id = user?.id ?? null;
export const first_name = user?.first_name ?? '';
export const last_name = user?.last_name ?? '';
export const username = user?.username ?? '';
export const language_code = user?.language_code ?? 'en';
export const photo_url = user?.photo_url ?? null;
export const startParam = tg?.initDataUnsafe?.start_param || 0;

// безопасный отступ сверху
export const safeTop = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0;

// обновляем CSS-переменную для использования в стилях
if (safeTop) {
    document.documentElement.style.setProperty('--tg-safe-top', `${safeTop}px`);
}

// следим за изменением отступов при ресайзе, смене ориентации и т.п.
tg?.onEvent?.('contentSafeAreaChanged', () => {
    const updatedTop = tg?.contentSafeAreaInset?.top ?? 0;
    document.documentElement.style.setProperty('--tg-safe-top', `${updatedTop}px`);
});
