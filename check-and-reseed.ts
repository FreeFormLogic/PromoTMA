import { allModulesData } from './server/seedModules';

async function checkAndReseed() {
  try {
    console.log(`Модулей в файле seedModules: ${allModulesData.length}`);
    
    // Подробный анализ модулей
    const modulesByNumber: { [key: number]: any[] } = {};
    
    allModulesData.forEach((module, index) => {
      if (!modulesByNumber[module.number]) {
        modulesByNumber[module.number] = [];
      }
      modulesByNumber[module.number].push({
        ...module,
        arrayIndex: index
      });
    });
    
    // Найдем дубликаты
    const duplicates: { [key: number]: any[] } = {};
    Object.entries(modulesByNumber).forEach(([number, modules]) => {
      if (modules.length > 1) {
        duplicates[parseInt(number)] = modules;
      }
    });
    
    if (Object.keys(duplicates).length > 0) {
      console.log('\n🔍 НАЙДЕННЫЕ ДУБЛИКАТЫ:');
      Object.entries(duplicates).forEach(([number, modules]) => {
        console.log(`\nМодуль ${number} (найдено ${modules.length} копий):`);
        modules.forEach((module, idx) => {
          console.log(`  ${idx + 1}. Позиция ${module.arrayIndex}: "${module.title}"`);
        });
      });
    }
    
    // Проверим последовательность
    const numbers = allModulesData.map(m => m.number).sort((a, b) => a - b);
    console.log(`\nДиапазон номеров: ${numbers[0]} - ${numbers[numbers.length - 1]}`);
    
    // Отсутствующие номера
    const expectedNumbers = Array.from({length: 140}, (_, i) => i + 1);
    const missingNumbers = expectedNumbers.filter(num => !numbers.includes(num));
    if (missingNumbers.length > 0) {
      console.log(`Отсутствующие номера: ${missingNumbers.join(', ')}`);
    }
    
    console.log(`\nВсего уникальных номеров: ${Object.keys(modulesByNumber).length}`);
    console.log(`Общее количество модулей: ${allModulesData.length}`);
    
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

checkAndReseed();