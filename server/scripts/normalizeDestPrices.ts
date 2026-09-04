import fs from 'fs';
import path from 'path';

// 1. Fix indiaDestinationsData.ts
const indiaDestPath = path.join(process.cwd(), 'server', 'data', 'indiaDestinationsData.ts');
let indiaDestCode = fs.readFileSync(indiaDestPath, 'utf-8');

const accuratePrices: Record<string, number> = {
  'dest-sindhudurg': 6500,
  'dest-mumbai': 7500,
  'dest-pune': 5500,
  'dest-goa': 8500,
  'dest-jaipur': 6800,
  'dest-manali': 8200,
  'dest-chettinad': 5800,
  'dest-varanasi': 5200,
  'dest-ladakh': 14500,
  'dest-kashmir': 12500,
  'dest-munnar': 7200,
  'dest-alleppey': 8400,
  'dest-coorg': 6200,
  'dest-hampi': 5800,
  'dest-shillong': 9200,
  'dest-tawang': 11800,
  'dest-andaman': 16500,
  'dest-lakshadweep': 18000,
  'dest-rishikesh': 5400,
  'dest-udaipur': 7800,
  'dest-jaisalmer': 6900
};

// Normalize any startingPrice > 25000 in domestic destinations
indiaDestCode = indiaDestCode.replace(/startingPrice:\s*(\d+)/g, (match, val) => {
  const num = parseInt(val, 10);
  if (num > 25000) {
    return `startingPrice: 6500`;
  }
  return match;
});

for (const [destId, price] of Object.entries(accuratePrices)) {
  const reg = new RegExp(`(id:\\s*'${destId}'[\\s\\S]*?startingPrice:\\s*)\\d+`);
  indiaDestCode = indiaDestCode.replace(reg, `$1${price}`);
}
fs.writeFileSync(indiaDestPath, indiaDestCode, 'utf-8');

// 2. Fix indiaRegionalDestinations.ts
const regDestPath = path.join(process.cwd(), 'server', 'data', 'indiaRegionalDestinations.ts');
let regDestCode = fs.readFileSync(regDestPath, 'utf-8');
regDestCode = regDestCode.replace(/startingPrice:\s*(\d+)/g, (match, val) => {
  const num = parseInt(val, 10);
  if (num > 25000) {
    return `startingPrice: 5800`;
  }
  return match;
});
fs.writeFileSync(regDestPath, regDestCode, 'utf-8');

console.log('✅ Normalized destination starting prices to ₹5,200 - ₹18,000 range');
