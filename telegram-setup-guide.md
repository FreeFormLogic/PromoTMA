# Инструкция по настройке Telegram Bot для Mini App

## Проблема "Bot domain invalid"

Для решения ошибки "Bot domain invalid" необходимо настроить домен в BotFather:

1. **Откройте @BotFather в Telegram**

2. **Выберите команду `/setdomain`**

3. **Выберите вашего бота**

4. **Введите домен приложения:**
   ```
   promotma.replit.app
   ```

5. **Для Mini App также настройте Web App URL:**
   - Команда: `/newapp`
   - Выберите бота
   - Введите название: `PromoTMA - Бизнес Модули`
   - Введите описание: `Каталог готовых модулей для Telegram Mini Apps`
   - Загрузите иконку (если есть)
   - **Введите URL:** `https://promotma.replit.app`

## Дополнительные настройки

- **Set Menu Button**: `/setmenubutton` - настройка кнопки меню
- **Set Commands**: `/setcommands` - настройка команд бота

После настройки домена авторизация через Telegram должна работать корректно.