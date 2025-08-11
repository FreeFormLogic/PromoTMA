// Простой скрипт для создания Telegram бота
// Вы можете запустить этот код через @BotFather в Telegram

console.log(`
Для создания бота:

1. Найдите @BotFather в Telegram
2. Отправьте команду: /newbot
3. Введите имя бота: Mini Apps Directory Bot
4. Введите username бота: miniapps_directory_bot (или любой доступный)
5. Получите токен бота
6. Отправьте команду: /setdomain
7. Выберите своего бота
8. Введите домен: ${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}

Токен сохраните в переменные окружения как TELEGRAM_BOT_TOKEN
`);