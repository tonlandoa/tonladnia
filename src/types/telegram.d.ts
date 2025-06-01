export { };

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        photo_url?: string;
                    };
                    start_param?: string;
                };
                close: () => void;
                sendData: (data: string) => void;
                expand: () => void;
                isExpanded: boolean;
                themeParams?: Record<string, string>;
            };
        };
    }
}
