import { eq } from 'drizzle-orm';
import { db } from './server/db';
import { modules, industries } from './shared/schema';
import { allIndustriesData } from './server/seedIndustries';
import { allModulesData } from './server/seedModules';

async function checkAndReseed() {
  try {
    console.log('🔍 Проверка базы данных...');
    
    // Проверяем модули
    const moduleCount = await db.select().from(modules);
    console.log(`📊 Модулей в базе: ${moduleCount.length}`);
    
    // Проверяем индустрии
    const industryCount = await db.select().from(industries);
    console.log(`🏭 Индустрий в базе: ${industryCount.length}`);
    
    // Проверяем аргумент принудительного обновления или нехватку данных
    const forceReseed = process.argv.includes('force');
    if (forceReseed || moduleCount.length < allModulesData.length || industryCount.length < 25) {
      if (forceReseed) {
        console.log('🚨 Принудительное обновление базы данных...');
      } else {
        console.log('🚨 Обнаружена нехватка данных, запуск пересоздания...');
      }
      
      // Очищаем таблицы
      await db.delete(modules);
      await db.delete(industries);
      console.log('🗑️  Таблицы очищены');
      
      // Заполняем индустрии
      for (const industry of allIndustriesData) {
        await db.insert(industries).values(industry);
      }
      console.log(`✅ Загружено ${allIndustriesData.length} индустрий`);
      
      // Заполняем модули
      for (const module of allModulesData) {
        await db.insert(modules).values(module);
      }
      console.log(`✅ Загружено ${allModulesData.length} модулей`);
      
      // Проверяем категорию ИНДОНЕЗИЯ
      const indonesiaModules = await db.select().from(modules).where(eq(modules.category, 'ИНДОНЕЗИЯ'));
      console.log(`🇮🇩 Модулей ИНДОНЕЗИЯ: ${indonesiaModules.length}`);
      
      console.log('🎉 Пересоздание данных завершено успешно!');
    } else {
      console.log('✅ База данных в порядке');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при пересоздании:', error);
    process.exit(1);
  }
}

checkAndReseed();