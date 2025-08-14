import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  DollarSign,
  Users, 
  Smartphone,
  CheckCircle,
  X,
  MessageCircle
} from 'lucide-react';

export default function Development() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Простой заголовок */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ваше преимущество
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Сравните традиционную разработку с Telegram Mini Apps
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            onClick={() => {
              const message = encodeURIComponent(
                "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
              );
              window.open(`https://t.me/balilegend?text=${message}`, '_blank');
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Получить консультацию
          </Button>
        </div>
      </section>

      {/* Простое сравнение */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Традиционная разработка */}
            <Card className="p-8 bg-white border border-red-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Традиционная разработка
                </h2>
                <div className="text-3xl font-bold text-red-600">$10,000</div>
                <p className="text-gray-600">и больше</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">6-12 месяцев</h3>
                    <p className="text-gray-600 text-sm">на разработку и запуск</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Высокие затраты</h3>
                    <p className="text-gray-600 text-sm">на команду разработчиков</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Нужно устанавливать</h3>
                    <p className="text-gray-600 text-sm">приложение из магазина</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Сложно привлечь</h3>
                    <p className="text-gray-600 text-sm">пользователей, нужен маркетинг</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Telegram Mini Apps */}
            <Card className="p-8 bg-white border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  ЭКОНОМИЯ 70%
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Telegram Mini Apps
                </h2>
                <div className="text-3xl font-bold text-blue-600">от $300</div>
                <p className="text-gray-600">готовое решение</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">1-5 дней</h3>
                    <p className="text-gray-600 text-sm">до запуска приложения</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">260+ модулей</h3>
                    <p className="text-gray-600 text-sm">готовых к использованию</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Без установки</h3>
                    <p className="text-gray-600 text-sm">работает прямо в Telegram</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">900+ млн пользователей</h3>
                    <p className="text-gray-600 text-sm">уже в Telegram</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Простые преимущества */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            Почему выбирают Telegram Mini Apps?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Быстро</h3>
              <p className="text-gray-600">От идеи до готового приложения за 1-5 дней</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Дешево</h3>
              <p className="text-gray-600">В 30 раз дешевле традиционной разработки</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Удобно</h3>
              <p className="text-gray-600">Пользователям не нужно ничего устанавливать</p>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Готовы начать экономить?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Получите готовое Telegram Mini App за 1-5 дней вместо месяцев разработки
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
            onClick={() => {
              const message = encodeURIComponent(
                "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
              );
              window.open(`https://t.me/balilegend?text=${message}`, '_blank');
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Обсудить мой проект
          </Button>
        </div>
      </section>
    </div>
  );
}