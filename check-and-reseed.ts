import { allIndustriesData } from './server/seedIndustries';

console.log('Current industries count:', allIndustriesData.length);
console.log('Industries list:');
allIndustriesData.forEach((industry, index) => {
  console.log(`${index + 1}. ${industry.name}`);
});