import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, Bot, Building2, Check, Rocket, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Single Hero Section - Clean, No Duplicates */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20 mb-12 rounded-2xl">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-6 bg-green-600 text-white px-6 py-2 text-lg font-semibold shadow-2xl">
                ТРЕНД 2025!
              </Badge>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Создайте{" "}
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Telegram Mini App
                </span>{" "}
                за 1-5 дней
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                260+ готовых модулей для быстрого запуска вашего бизнеса в Telegram. От $300 вместо $10,000 за традиционную разработку.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">1-5</div>
                  <div className="text-sm text-blue-100">дней до запуска</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">260+</div>
                  <div className="text-sm text-blue-100">модулей</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">900+</div>
                  <div className="text-sm text-blue-100">млн пользователей</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-100">поддержка</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => window.location.href = '/ai-chat'}
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                >
                  <Bot className="mr-2 w-5 h-5" />
                  AI-конструктор APP
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Comparison Section */}
        <section className="mb-12 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Зачем переплачивать?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Сравните традиционную разработку с готовыми модульными решениями Telegram Mini Apps
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Traditional Development */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Традиционная разработка</h3>
                    <div className="text-4xl font-bold text-gray-700 mb-1">$10,000</div>
                    <p className="text-gray-600">Высокие затраты на разработку</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">6-12 месяцев разработки</p>
                        <p className="text-gray-600 text-sm">Долгие сроки до запуска продукта</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Установка приложения</p>
                        <p className="text-gray-600 text-sm">Барьер для пользователей, потеря аудитории</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Привлечение пользователей</p>
                        <p className="text-gray-600 text-sm">Большие затраты на маркетинг и продвижение</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Команда разработчиков</p>
                        <p className="text-gray-600 text-sm">Поиск и содержание штатных специалистов</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Telegram Mini Apps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200 relative overflow-hidden shadow-xl">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                      ТРЕНД 2025!
                    </Badge>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-0">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Telegram Mini Apps</h3>
                    <div className="text-4xl font-bold text-blue-700 mb-1">$300</div>
                    <p className="text-blue-700">Решения под ключ</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">1-5 дней до запуска</p>
                        <p className="text-blue-700 text-sm">Мгновенный результат с готовыми модулями</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">Работает внутри Telegram</p>
                        <p className="text-blue-700 text-sm">Без установки, сразу доступно пользователям</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">900+ млн пользователей</p>
                        <p className="text-blue-700 text-sm">Огромная аудитория уже в Telegram</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">260+ модулей</p>
                        <p className="text-blue-700 text-sm">Проверенные решения для любого бизнеса</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                onClick={() => {
                  const message = encodeURIComponent(
                    "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
                  );
                  window.open(`https://t.me/balilegend?text=${message}`, '_blank');
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >Создать приложение</Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="text-telegram text-2xl" />
                <h3 className="text-lg font-semibold">Mini Apps Directory</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Полноценные веб-приложения внутри Telegram за 1-5 дней.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Telegram Mini Apps
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Преимущества</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>✓ 260+ модулей</li>
                <li>✓ Запуск за 1-5 дней</li>
                <li>✓ От $300 вместо $10,000</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400 text-sm">
            © 2025 Telegram Mini Apps Directory
          </div>
        </div>
      </footer>
    </div>
  );
}