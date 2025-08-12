import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Smartphone, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  Star,
  MessageCircle
} from 'lucide-react';

export default function Development() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Telegram Mini App
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Ваше конкурентное преимущество в 2024-2025 годах
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Создайте экосистему для вашего бизнеса внутри Telegram, экономьте миллионы на разработке 
              и получайте прямой доступ к 900+ миллионам пользователей.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Получить бесплатную консультацию
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Business Math Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Бизнес-математика, которая убеждает</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Direct Savings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-600/30">
                <CreditCard className="w-12 h-12 text-green-400 mb-6" />
                <h3 className="text-2xl font-bold text-green-400 mb-6">Прямая экономия</h3>
                <div className="space-y-4 text-gray-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>0% комиссия через Telegram Stars</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>Экономия до 4 млн ₽ на разработке в сравнении с iOS/Android</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>Экономия до 2.16 млн ₽/год на отказе от дорогих платформ</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>Экономия ~500 000 ₽/год на продвижении в App Store</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Revenue Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-600/30">
                <TrendingUp className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold text-blue-400 mb-6">Кратный рост доходов</h3>
                <div className="space-y-4 text-gray-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    <span>Снижение стоимости клиента на 70%</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    <span>Рост конверсии в продажи до 60%</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    <span>Увеличение LTV клиента в 3-5 раз</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    <span>Рост повторных продаж на 60%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Operational Efficiency */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-600/30">
                <Zap className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold text-purple-400 mb-6">Операционная эффективность</h3>
                <div className="space-y-4 text-gray-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-400 mr-3" />
                    <span>Автоматизация 80% рутинных процессов</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-400 mr-3" />
                    <span>Освобождение до 6 часов рабочего времени команды в день</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-400 mr-3" />
                    <span>Окупаемость инвестиций (ROI) 300-500% в первый год</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Advantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Почему это стратегически верное решение</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 h-full bg-gray-800/50 border-gray-700">
                <TrendingUp className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Опередите рынок</h3>
                <p className="text-gray-300">
                  Пока ваши конкуренты только присматриваются к технологии, вы уже будете зарабатывать 
                  и захватывать долю рынка. Запуск MVP всего за 2-4 недели.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full bg-gray-800/50 border-gray-700">
                <Shield className="w-12 h-12 text-green-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Полная независимость и контроль</h3>
                <p className="text-gray-300">
                  Забудьте о правилах и комиссиях Apple и Google. Ваша клиентская база, ваши правила, 
                  ваши доходы — всё принадлежит только вам.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 h-full bg-gray-800/50 border-gray-700">
                <Globe className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Неприступная экосистема</h3>
                <p className="text-gray-300">
                  Вы строите не просто приложение, а целую экосистему вокруг клиента, которую 
                  конкурентам будет практически невозможно скопировать.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Кому это критически важно внедрить сейчас?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "E-commerce",
                description: "для снижения зависимости от маркетплейсов"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Образование", 
                description: "для удержания учеников и повышения завершаемости курсов"
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Рестораны",
                description: "для организации прямых заказов и доставки без комиссий агрегаторов"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Сфера услуг",
                description: "для полной автоматизации онлайн-записи, оплаты и коммуникации"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Инфобизнес",
                description: "B2B, стартапы и локальный бизнес"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Международные проекты",
                description: "для выхода на глобальный рынок через Telegram"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
                  <div className="text-blue-400 mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Experience */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Ваш новый уровень комфорта: что получат ваши клиенты</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-gray-800/50 border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-blue-400">Мгновенный доступ и простота</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>• Не нужно ничего скачивать, не занимает память</p>
                    <p>• Вход в один клик без регистрации и паролей</p>
                    <p>• Всегда под рукой, работает даже без интернета</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-gray-800/50 border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-green-400">Уникальный опыт</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>• AR-примерка товаров через камеру</p>
                    <p>• Интерактивный 3D-просмотр продуктов</p>
                    <p>• Персональные предложения и видео-консультации</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-gray-800/50 border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">Приятные бонусы и общение</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>• Групповые покупки с друзьями для получения скидок</p>
                    <p>• Игровые механики, челленджи и программы лояльности</p>
                    <p>• Удобная оплата любым способом</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center">
                  <Smartphone className="w-32 h-32 text-white" />
                </div>
                <div className="absolute -top-4 -right-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-800" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Действуйте сейчас, пока это делают ваши конкуренты</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Telegram Mini Apps — главный тренд 2024-2025 годов. Мы предлагаем быстрый старт благодаря 
              библиотеке из 220+ готовых модулей и гарантируем результат, фиксируя KPI в договоре.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-4">
              <MessageCircle className="w-6 h-6 mr-3" />
              Обсудить мой проект
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}