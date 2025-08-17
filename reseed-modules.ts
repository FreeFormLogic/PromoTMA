import { db } from "./server/db";
import { modules } from "./shared/schema";
import { sql } from "drizzle-orm";

async function reseedModules() {
  try {
    console.log("🔄 Обновление модулей в базе данных...");
    
    // Удаляем все существующие модули
    await db.delete(modules);
    console.log("✅ Существующие модули удалены");
    
    // Загружаем все модули из seedModules.ts
    const { allModulesData } = await import("./server/seedModules");
    
    // Добавляем все модули включая новый модуль 261
    await db.insert(modules).values(allModulesData);
    
    console.log(`✅ Добавлено ${allModulesData.length} модулей, включая отраслевой модуль турагентства (261)`);
    
    // Проверяем, что модуль 261 действительно добавлен
    const tourismModule = await db.select().from(modules).where(sql`number = 261`);
    if (tourismModule.length > 0) {
      console.log("✅ Модуль 261 (Управление турагентством) успешно добавлен!");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при обновлении модулей:", error);
    process.exit(1);
  }
}

reseedModules();