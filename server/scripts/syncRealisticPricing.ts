import fs from 'fs';
import path from 'path';

// 1. Update packagesData.ts
const packagesDataPath = path.join(process.cwd(), 'server', 'data', 'packagesData.ts');
let packagesCode = fs.readFileSync(packagesDataPath, 'utf-8');

const packagePrices: Record<string, {
  startingPrice: number;
  priceBreakdown: {
    hotelStay: number;
    transport: number;
    activities: number;
    meals: number;
    taxesAndFees: number;
    discount: number;
    totalPerPerson: number;
  };
}> = {
  'pkg-goa-coastal': {
    startingPrice: 24500,
    priceBreakdown: { hotelStay: 11500, transport: 4200, activities: 5200, meals: 3800, taxesAndFees: 1800, discount: 2000, totalPerPerson: 24500 }
  },
  'pkg-kerala-backwaters': {
    startingPrice: 34500,
    priceBreakdown: { hotelStay: 16500, transport: 6800, activities: 6200, meals: 5500, taxesAndFees: 2500, discount: 3000, totalPerPerson: 34500 }
  },
  'pkg-rajasthan-heritage': {
    startingPrice: 48000,
    priceBreakdown: { hotelStay: 24000, transport: 9500, activities: 8000, meals: 7500, taxesAndFees: 3000, discount: 4000, totalPerPerson: 48000 }
  },
  'pkg-kashmir-valley': {
    startingPrice: 42000,
    priceBreakdown: { hotelStay: 21000, transport: 8000, activities: 7500, meals: 6500, taxesAndFees: 2500, discount: 3500, totalPerPerson: 42000 }
  },
  'pkg-himachal-adventure': {
    startingPrice: 28500,
    priceBreakdown: { hotelStay: 13500, transport: 6500, activities: 5500, meals: 4500, taxesAndFees: 1500, discount: 3000, totalPerPerson: 28500 }
  },
  'pkg-konkan-coastal': {
    startingPrice: 18500,
    priceBreakdown: { hotelStay: 8500, transport: 3800, activities: 3600, meals: 2800, taxesAndFees: 1300, discount: 1500, totalPerPerson: 18500 }
  },
  'pkg-karnataka-heritage': {
    startingPrice: 26500,
    priceBreakdown: { hotelStay: 12500, transport: 5800, activities: 4800, meals: 3800, taxesAndFees: 1600, discount: 2000, totalPerPerson: 26500 }
  },
  'pkg-tamilnadu-temples': {
    startingPrice: 23500,
    priceBreakdown: { hotelStay: 11000, transport: 5200, activities: 4200, meals: 3500, taxesAndFees: 1600, discount: 2000, totalPerPerson: 23500 }
  },
  'pkg-northeast-explorer': {
    startingPrice: 38000,
    priceBreakdown: { hotelStay: 18500, transport: 8500, activities: 6200, meals: 5200, taxesAndFees: 2600, discount: 3000, totalPerPerson: 38000 }
  },
  'pkg-maharashtra-escape': {
    startingPrice: 16500,
    priceBreakdown: { hotelStay: 8200, transport: 3500, activities: 3200, meals: 2400, taxesAndFees: 1200, discount: 2000, totalPerPerson: 16500 }
  },
  'pkg-bali-escape': {
    startingPrice: 88000,
    priceBreakdown: { hotelStay: 42000, transport: 15000, activities: 18000, meals: 13000, taxesAndFees: 6000, discount: 6000, totalPerPerson: 88000 }
  },
  'pkg-swiss-alps': {
    startingPrice: 245000,
    priceBreakdown: { hotelStay: 120000, transport: 55000, activities: 45000, meals: 32000, taxesAndFees: 13000, discount: 20000, totalPerPerson: 245000 }
  },
  'pkg-tokyo-future': {
    startingPrice: 185000,
    priceBreakdown: { hotelStay: 90000, transport: 42000, activities: 35000, meals: 26000, taxesAndFees: 10000, discount: 18000, totalPerPerson: 185000 }
  }
};

for (const [pkgId, pricing] of Object.entries(packagePrices)) {
  const pkgRegex = new RegExp(`(id:\\s*'${pkgId}'[\\s\\S]*?startingPrice:\\s*)\\d+([\\s\\S]*?priceBreakdown:\\s*\\{[\\s\\S]*?\\})`);
  const match = packagesCode.match(pkgRegex);
  if (match) {
    const formattedBreakdown = `priceBreakdown: {
      hotelStay: ${pricing.priceBreakdown.hotelStay},
      transport: ${pricing.priceBreakdown.transport},
      activities: ${pricing.priceBreakdown.activities},
      meals: ${pricing.priceBreakdown.meals},
      taxesAndFees: ${pricing.priceBreakdown.taxesAndFees},
      discount: ${pricing.priceBreakdown.discount},
      totalPerPerson: ${pricing.priceBreakdown.totalPerPerson}
    }`;
    packagesCode = packagesCode.replace(pkgRegex, `$1${pricing.startingPrice}$2`);
    const breakdownRegex = new RegExp(`(id:\\s*'${pkgId}'[\\s\\S]*?priceBreakdown:\\s*\\{[\\s\\S]*?\\})`);
    packagesCode = packagesCode.replace(breakdownRegex, (m) => {
      return m.replace(/priceBreakdown:\s*\{[\s\S]*?\}/, formattedBreakdown);
    });
  }
}
fs.writeFileSync(packagesDataPath, packagesCode, 'utf-8');
console.log('✅ Updated packagesData.ts pricing');

// 2. Update indiaDestinationsData.ts
const indiaDestPath = path.join(process.cwd(), 'server', 'data', 'indiaDestinationsData.ts');
let indiaDestCode = fs.readFileSync(indiaDestPath, 'utf-8');

const destStartingPrices: Record<string, number> = {
  'dest-sindhudurg': 6500,
  'dest-mumbai': 7500,
  'dest-pune': 5500,
  'dest-goa': 8500,
  'dest-jaipur': 6800,
  'dest-manali': 8200,
  'dest-chettinad': 5800,
  'dest-varanasi': 5200
};

for (const [destId, price] of Object.entries(destStartingPrices)) {
  const reg = new RegExp(`(id:\\s*'${destId}'[\\s\\S]*?startingPrice:\\s*)\\d+`);
  indiaDestCode = indiaDestCode.replace(reg, `$1${price}`);
}
// Replace any remaining startingPrice: < 5000 in indiaDestCode with realistic values
indiaDestCode = indiaDestCode.replace(/startingPrice:\s*(\d{2,3})/g, (match, val) => {
  const num = parseInt(val, 10);
  if (num < 5000) {
    return `startingPrice: ${num * 55}`;
  }
  return match;
});
fs.writeFileSync(indiaDestPath, indiaDestCode, 'utf-8');
console.log('✅ Updated indiaDestinationsData.ts pricing');

// 3. Update indiaRegionalDestinations.ts
const regDestPath = path.join(process.cwd(), 'server', 'data', 'indiaRegionalDestinations.ts');
let regDestCode = fs.readFileSync(regDestPath, 'utf-8');
regDestCode = regDestCode.replace(/startingPrice:\s*(\d{2,3})/g, (match, val) => {
  const num = parseInt(val, 10);
  if (num < 5000) {
    return `startingPrice: ${Math.max(5200, num * 55)}`;
  }
  return match;
});
fs.writeFileSync(regDestPath, regDestCode, 'utf-8');
console.log('✅ Updated indiaRegionalDestinations.ts pricing');

// 4. Update initialData.ts
const initialDataPath = path.join(process.cwd(), 'server', 'data', 'initialData.ts');
let initialDataCode = fs.readFileSync(initialDataPath, 'utf-8');
initialDataCode = initialDataCode.replace(/(id:\s*'dest-bali'[\s\S]*?startingPrice:\s*)\d+/, '$142000');
initialDataCode = initialDataCode.replace(/(id:\s*'dest-switzerland'[\s\S]*?startingPrice:\s*)\d+/, '$195000');
initialDataCode = initialDataCode.replace(/(id:\s*'dest-tokyo'[\s\S]*?startingPrice:\s*)\d+/, '$178000');
fs.writeFileSync(initialDataPath, initialDataCode, 'utf-8');
console.log('✅ Updated initialData.ts pricing');
