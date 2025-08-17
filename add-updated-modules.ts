import { db } from "./server/db";
import { modules } from "./shared/schema";
import { allModulesData } from "./server/seedModules";

// Номера модулей, которые нужно добавить (обновленные версии с русскими названиями)
const moduleNumbersToAdd = [176, 177, 178, 179, 181, 182, 183, 184, 186, 191, 192, 196, 199, 204, 206, 207, 208, 209, 210, 211, 213, 214, 215, 217];

async function addUpdatedModules() {
  try {
    console.log("Добавляем обновленные модули с русскими названиями...");
    
    // Получаем модули для добавления
    const modulesToAdd = allModulesData.filter(module => 
      moduleNumbersToAdd.includes(module.number)
    );
    
    console.log(`Найдено ${modulesToAdd.length} модулей для добавления`);
    
    // Добавляем каждый модуль
    for (const module of modulesToAdd) {
      await db.insert(modules).values(module);
      console.log(`✅ Добавлен модуль ${module.number}: ${module.name}`);
    }
    
    console.log("\n🎉 Все модули успешно добавлены!");
    
    // Проверяем общее количество модулей
    const allModules = await db.select().from(modules);
    console.log(`Общее количество модулей в базе: ${allModules.length}`);
    
  } catch (error) {
    console.error("Ошибка при добавлении модулей:", error);
  } finally {
    process.exit(0);
  }
}

addUpdatedModules();