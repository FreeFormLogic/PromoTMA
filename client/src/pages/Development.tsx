import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Star,
  DollarSign,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Development() {
  const [activeTab, setActiveTab] = useState<'client' | 'sales'>('client');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Ваше решающее преимущество: Telegram Mini Apps
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            Откройте для себя, как TMA трансформируют бизнес, и получите все аргументы для уверенных продаж.
          </p>
        </div>

        {/* Навигация по вкладкам */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('client')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'client'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Преимущества для Клиента
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Аргументы для Продавца
            </button>
          </nav>
        </div>

        {/* Содержимое вкладок */}
        <AnimatePresence mode="wait">
          {activeTab === 'client' && (
            <motion.div
              key="client"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Тематическая Группа 1: Финансовая Трансформация */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Превратите расходы в прибыль и инвестируйте в рост
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Карточка 1: Радикальное снижение издержек */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Радикальное снижение издержек
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Экономьте миллионы на разработке, поддержке и комиссиях, направляя ресурсы на развитие.
                        </p>
                        <button
                          onClick={() => toggleCard('cost-reduction')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'cost-reduction' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'cost-reduction' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">0% Комиссия на платежи:</strong> Забудьте о 2-5% комиссии с каждой транзакции при использовании Telegram Stars. При обороте в 20 млн ₽ это до 600 000 ₽ чистой экономии ежемесячно, которые можно реинвестировать.
                            </li>
                            <li>
                              <strong className="text-white">В 5-10 раз дешевле нативных приложений:</strong> Разработка под iOS и Android стоит 2-5 млн ₽. Полнофункциональный TMA — от 300 тыс. ₽. Вы получаете тот же результат за меньшие деньги и в более короткие сроки.
                            </li>
                            <li>
                              <strong className="text-white">Отказ от дорогих подписок:</strong> Замените GetCourse, Tilda, CRM и другие сервисы единой экосистемой. Это прямая экономия до 2 млн ₽ в год на операционных расходах.
                            </li>
                            <li>
                              <strong className="text-white">Нулевые затраты на продвижение в сторах:</strong> Вам больше не нужно тратить до 500 000 ₽ в год на ASO и платные установки, чтобы вас заметили. Ваша аудитория уже в Telegram.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Карточка 2: Взрывной рост выручки и LTV */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Взрывной рост выручки и LTV
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Увеличивайте конверсию, средний чек и пожизненную ценность клиента.
                        </p>
                        <button
                          onClick={() => toggleCard('revenue-growth')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'revenue-growth' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'revenue-growth' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">Рост конверсии на 40-60%:</strong> Бесшовный путь от знакомства до покупки внутри Telegram повышает конверсию с условных 2% до 3.2% и выше. Меньше кликов — больше продаж.
                            </li>
                            <li>
                              <strong className="text-white">Увеличение LTV в 3-5 раз:</strong> Глубокая персонализация, система лояльности и мгновенные повторные продажи через push-уведомления поднимают средний чек с 5000 ₽ до 15000+ ₽, превращая клиента в постоянный источник дохода.
                            </li>
                            <li>
                              <strong className="text-white">Рост повторных продаж на 60%:</strong> Автоматические напоминания о брошенной корзине и персональные предложения, основанные на истории покупок, превращают разовых покупателей в постоянных клиентов.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* Тематическая Группа 2: Стратегическое Доминирование */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                  Опережайте конкурентов, а не догоняйте их
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Карточка 1: Скорость как главное оружие */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Zap className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Скорость как главное оружие
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Запускайтесь и обновляйтесь быстрее, чем кто-либо на вашем рынке.
                        </p>
                        <button
                          onClick={() => toggleCard('speed-weapon')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'speed-weapon' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'speed-weapon' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">Запуск за 2-4 недели, а не за полгода.</strong> Пока конкуренты проходят долгие согласования в App Store и Google Play, вы уже получаете прибыль и собираете базу лояльных клиентов.
                            </li>
                            <li>
                              <strong className="text-white">Мгновенные обновления.</strong> Вносите изменения, тестируйте гипотезы и добавляйте новый функционал хоть каждый день, без ожидания ревью и согласований от Apple и Google.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Карточка 2: Создание неприступной крепости */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Создание неприступной крепости
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Займите уникальную позицию на рынке, которую будет невозможно скопировать.
                        </p>
                        <button
                          onClick={() => toggleCard('market-fortress')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'market-fortress' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'market-fortress' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">Будьте первыми на новом рынке.</strong> Займите нишу в Telegram, пока она свободна. Конкурентам будет сложно и дорого вас догонять, когда вы уже закрепились.
                            </li>
                            <li>
                              <strong className="text-white">Полная независимость от гигантов.</strong> Ваша база клиентов, ваши правила, ваши доходы. Вы не зависите от внезапных изменений политики App Store и Google Play, которые могут разрушить бизнес.
                            </li>
                            <li>
                              <strong className="text-white">Создайте экосистему, которую невозможно скопировать.</strong> TMA — это не просто приложение, а глубоко интегрированное в жизнь клиента решение. Оно формирует привычку и высочайшую лояльность, создавая барьер для входа конкурентов.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* Тематическая Группа 3: Непревзойденный Клиентский Опыт */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                  Подарите клиентам удобство, которого у них никогда не было
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Карточка 1: Абсолютная бесшовность */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Star className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Абсолютная бесшовность
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Устраните все барьеры между клиентом и вашим продуктом.
                        </p>
                        <button
                          onClick={() => toggleCard('seamless')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'seamless' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'seamless' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">Никаких скачиваний и установок.</strong> Доступ к вашему сервису в один клик для 900 млн пользователей Telegram. Вы устраняете главное препятствие на пути клиента к покупке.
                            </li>
                            <li>
                              <strong className="text-white">Не занимает память телефона.</strong> Клиенты скажут вам "спасибо" за то, что вы не заставляете их удалять фотографии ради вашего приложения. Это маленький, но важный знак уважения.
                            </li>
                            <li>
                              <strong className="text-white">Вход в 1 клик.</strong> Никаких паролей и утомительных форм регистрации. Авторизация происходит мгновенно через Telegram-аккаунт, который уже есть у всех ваших клиентов.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Карточка 2: Глубокая персонализация */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Star className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Глубокая персонализация и вовлечение
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Превратите пользователей в фанатов вашего бренда.
                        </p>
                        <button
                          onClick={() => toggleCard('personalization')}
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        >
                          <span>Подробнее</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              expandedCard === 'personalization' ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === 'personalization' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-3 text-gray-300 mt-4 border-t border-gray-700 pt-4">
                            <li>
                              <strong className="text-white">Общение на "ты".</strong> Прямая коммуникация и нативные push-уведомления с доставляемостью 95% гарантируют, что ваши сообщения будут прочитаны, в отличие от email-рассылок и уведомлений обычных приложений.
                            </li>
                            <li>
                              <strong className="text-white">AI-ассистент и персонализация.</strong> Искусственный интеллект подбирает товары, контент и предложения индивидуально для каждого, создавая ощущение, что сервис сделан лично для него.
                            </li>
                            <li>
                              <strong className="text-white">Геймификация и вирусность.</strong> Встроенные челленджи, реферальные программы и возможность поделиться в чатах превращают клиентов в ваших самых эффективных и бесплатных промоутеров.
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Ключевые цифры */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Цифры, которые продают за вас
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
                  {[
                    { value: '900 млн', label: 'Потенциальная аудитория' },
                    { value: '0%', label: 'Комиссия в Telegram Stars' },
                    { value: 'до 70%', label: 'Снижение CAC' },
                    { value: '95%', label: 'Push-уведомления' },
                    { value: 'x5', label: 'Рост LTV клиента' },
                    { value: '2-4 нед.', label: 'Срок запуска MVP' },
                    { value: 'до 80%', label: 'Экономия времени команды' },
                    { value: 'x10', label: 'Потенциал вирусного роста' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg">
                      <p className="text-5xl font-extrabold text-blue-400 mb-2">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-lg font-medium text-gray-300">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Работа с возражениями */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                  Ответы на неудобные вопросы
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      question: 'Возражение 1: "Это дорого. 300 тыс. ₽ — это много."',
                      answer: 'Давайте сравним. Нативное приложение стоит 2-5 млн ₽, и это только разработка. Добавьте сюда зарплату команды поддержки, плату за продвижение в App Store (от 500 тыс. ₽ в год), комиссии платформ. Наш TMA заменяет все это и окупается за 3-4 месяца только на экономии. Это не расход, это самая выгодная инвестиция в вашу инфраструктуру на сегодня. ROI в первый год составляет 300-500%.'
                    },
                    {
                      id: 2,
                      question: 'Возражение 2: "У нас уже есть сайт/мобильное приложение."',
                      answer: 'Отлично, значит у вас уже есть аудитория, которую мы можем "активировать". TMA не заменяет сайт, он его дополняет и многократно усиливает. Мы создаем бесшовный мост между вашим текущим трафиком и экосистемой Telegram, где конверсия выше на 40-60%, а доставляемость уведомлений — 95%. Мы превратим ваших посетителей в лояльных, постоянно покупающих клиентов, с которыми у вас будет прямой и гарантированный контакт.'
                    },
                    {
                      id: 3,
                      question: 'Возражение 3: "Насколько это безопасно?"',
                      answer: 'Безопасность на уровне самого Telegram, который считается одним из самых защищенных мессенджеров в мире. Все данные передаются с использованием end-to-end шифрования. Авторизация через Telegram-аккаунт безопаснее, чем связка логин/пароль, так как она по умолчанию защищена двухфакторной аутентификацией самого мессенджера. Мы используем лучшие мировые практики безопасности.'
                    },
                    {
                      id: 4,
                      question: 'Возражение 4: "Наша аудитория не сидит в Telegram."',
                      answer: 'Telegram — это 900 млн активных пользователей по всему миру и мессенджер №1 во многих странах, включая Россию. Вероятность того, что ваша аудитория уже здесь, крайне высока. Вопрос лишь в том, начнете ли вы с ней работать напрямую или это сделают ваши конкуренты. Мы можем даже провести анализ и показать, сколько тематических каналов и чатов существует именно в вашей нише, чтобы подтвердить это.'
                    },
                    {
                      id: 5,
                      question: 'Возражение 5: "Это просто очередной тренд, который скоро пройдет."',
                      answer: 'Это не тренд, а эволюция. Люди проводят все больше времени в мессенджерах. Telegram активно инвестирует в платформу Mini Apps, делая ее ключевой частью своей стратегии. Это новая парадигма ведения бизнеса, такая же, какой когда-то стали веб-сайты, а затем мобильные приложения. Те, кто освоит ее первыми, получат максимальное преимущество.'
                    }
                  ].map((item) => (
                    <div key={item.id} className="border-b border-gray-700 py-4">
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full flex justify-between items-center text-left text-xl font-semibold text-white hover:text-blue-400 transition-colors"
                      >
                        <span>{item.question}</span>
                        <ChevronDown 
                          className={`w-6 h-6 transition-transform ${
                            openAccordion === item.id ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      <AnimatePresence>
                        {openAccordion === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 text-gray-300 space-y-2">
                              <p>{item.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>

              {/* Сравнительная таблица */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                  TMA vs. Альтернативы: наглядное сравнение
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">
                          Метрика
                        </th>
                        <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white bg-blue-900/30">
                          ✅ Telegram Mini App
                        </th>
                        <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">
                          📱 Нативное приложение (iOS/Android)
                        </th>
                        <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">
                          🌐 Веб-сайт + CRM
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-900">
                      {[
                        {
                          metric: 'Стоимость разработки',
                          tma: '300 тыс. - 800 тыс. ₽',
                          native: '2 млн - 5 млн ₽',
                          web: '500 тыс. - 1.5 млн ₽'
                        },
                        {
                          metric: 'Срок запуска',
                          tma: '2-4 недели (MVP)',
                          native: '4-8 месяцев',
                          web: '2-3 месяца'
                        },
                        {
                          metric: 'Комиссии платформ',
                          tma: '0% (Telegram Stars), 2-3% (другие)',
                          native: '15-30% (Apple/Google)',
                          web: '2-3.5% (эквайринг)'
                        },
                        {
                          metric: 'Доступ к аудитории',
                          tma: 'Прямой, 900 млн',
                          native: 'Через платные установки и ASO',
                          web: 'Через SEO и платную рекламу'
                        },
                        {
                          metric: 'Конверсия в действие',
                          tma: 'Высокая (без установки)',
                          native: 'Низкая (требует установки)',
                          web: 'Средняя'
                        },
                        {
                          metric: 'Канал коммуникации',
                          tma: 'Нативные Push (95% open rate)',
                          native: 'Push (40-60% open rate)',
                          web: 'Email (15-25% open rate)'
                        },
                        {
                          metric: 'Зависимость от платформ',
                          tma: 'Низкая (от Telegram API)',
                          native: 'Высокая (от Apple/Google)',
                          web: 'Средняя (от хостинга, SEO)'
                        }
                      ].map((row, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-300">
                            {row.metric}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-white bg-blue-900/30">
                            <strong>{row.tma}</strong>
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                            {row.native}
                          </td>
                          <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                            {row.web}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Целевые вертикали */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-white mt-12 mb-6">
                  Кому это нужно "еще вчера"
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      title: 'E-commerce/Ритейл',
                      description: 'Для снижения зависимости от маркетплейсов, уменьшения возвратов (через AR-примерку) и кратного роста повторных продаж за счет прямого контакта с клиентом.'
                    },
                    {
                      title: 'Онлайн-образование/Инфобизнес',
                      description: 'Для удержания учеников в единой среде, геймификации обучения, продажи курсов и отказа от дорогих и громоздких платформ типа GetCourse.'
                    },
                    {
                      title: 'HoReCa (Рестораны/Отели)',
                      description: 'Для создания систем лояльности, онлайн-бронирования, прямых заказов доставки без комиссий агрегаторов и мгновенного информирования о спецпредложениях.'
                    },
                    {
                      title: 'Сфера услуг (Салоны, Клиники, Фитнес)',
                      description: 'Для полной автоматизации записи, управления расписанием мастеров, онлайн-оплат и автоматических напоминаний клиентам, что снижает "неприходы".'
                    },
                    {
                      title: 'Стартапы',
                      description: 'Для быстрого и дешевого тестирования гипотез (запуск MVP за 2 недели) и вирусного привлечения первых пользователей с минимальным маркетинговым бюджетом.'
                    },
                    {
                      title: 'B2B Компании',
                      description: 'Для создания дилерских порталов, баз знаний для партнеров, автоматизации документооборота и внутренних HR-процессов, таких как онбординг и обучение.'
                    }
                  ].map((vertical, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {vertical.title}
                        </h3>
                        <p className="text-gray-300">
                          {vertical.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA секция */}
        <section className="mt-20 text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Готовы получить решающее преимущество?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Начните трансформацию своего бизнеса с Telegram Mini Apps уже сегодня
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base max-w-xs sm:max-w-none"
            onClick={() => {
              const message = encodeURIComponent(
                "Привет! Изучил ваши материалы по Telegram Mini Apps. Впечатляющие цифры и преимущества! Хочу обсудить возможности для моего бизнеса. Когда можем созвониться?"
              );
              window.open(`https://t.me/balilegend?text=${message}`, '_blank');
            }}
          >
            Получить консультацию
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </section>
      </div>
    </div>
  );
}