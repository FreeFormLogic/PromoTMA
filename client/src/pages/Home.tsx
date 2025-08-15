import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, Bot, Building2, Check, Rocket, MessageSquare, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20 mb-12 rounded-2xl">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">

              
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
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => window.location.href = '/ai-chat'}
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                >
                  <Bot className="mr-2 w-5 h-5" />
                  AI-конструктор
                </Button>
                <Button
                  onClick={() => window.location.href = '/modules'}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold rounded-full transition-all"
                >
                  <Package className="mr-2 w-5 h-5" />
                  Каталог модулей
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Features Section */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Быстрый запуск</h3>
                <p className="text-gray-600">Готовые модули позволяют запустить приложение за 1-5 дней</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">260+ модулей</h3>
                <p className="text-gray-600">Проверенные решения для любого типа бизнеса</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">В Telegram</h3>
                <p className="text-gray-600">900+ млн пользователей уже имеют доступ к вашему приложению</p>
              </motion.div>
            </div>
            
            <div className="text-center mt-12">
              <Button
                onClick={() => {
                  const message = encodeURIComponent(
                    "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
                  );
                  window.open(`https://t.me/balilegend?text=${message}`, '_blank');
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Создать приложение
              </Button>
            </div>
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