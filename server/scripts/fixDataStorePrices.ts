import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'data_store.json');
const db = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));

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

if (db.destinations) {
  db.destinations = db.destinations.map((d: any) => {
    if (accuratePrices[d.id]) {
      return { ...d, startingPrice: accuratePrices[d.id] };
    }
    if (d.startingPrice > 25000 && !d.isInternational) {
      return { ...d, startingPrice: 6500 };
    }
    return d;
  });
}

fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
console.log('✅ Directly updated data_store.json destinations startingPrice');
