export const storeCategories = [
  { id: 'all', name: 'All products', icon: '✳' },
  { id: 'components', name: 'PC Components', icon: '▦' },
  { id: 'keyboards', name: 'Keyboards', icon: '⌨' },
  { id: 'mice', name: 'Mice', icon: '◉' },
  { id: 'monitors', name: 'Monitors', icon: '▣' },
  { id: 'audio', name: 'Audio', icon: '◖' },
  { id: 'laptops', name: 'Laptops', icon: '▰' },
  { id: 'accessories', name: 'Accessories', icon: '◇' },
  { id: 'custom-pcs', name: 'Custom PCs', icon: '▥' }
];

export const demoProducts = [
  { id: 'sample-keyboard-01', name: 'Arc 75 Wireless Mechanical Keyboard', brand: 'Concept Hardware', category: 'keyboards', description: 'A compact 75% layout, satisfying switches and a refined wireless desk setup concept.', priceINR: 2799, compareAtINR: 3699, art: 'keyboard', tone: 'mint', featured: true },
  { id: 'sample-mouse-01', name: 'Vector Lightweight Gaming Mouse', brand: 'Concept Hardware', category: 'mice', description: 'A precision-focused lightweight gaming mouse with a clean ergonomic silhouette.', priceINR: 1599, compareAtINR: 2299, art: 'mouse', tone: 'stone', featured: true },
  { id: 'sample-monitor-01', name: 'Vision 27 QHD IPS Display', brand: 'Concept Displays', category: 'monitors', description: 'A premium 27-inch QHD monitor showcase with a slim-bezel display design.', priceINR: 16999, compareAtINR: 20999, art: 'monitor', tone: 'ice', featured: true },
  { id: 'sample-headphones-01', name: 'Studio One Over-Ear Headphones', brand: 'Concept Audio', category: 'audio', description: 'A minimal over-ear headset for creators, gamers and focused listening.', priceINR: 2299, compareAtINR: 2999, art: 'headphones', tone: 'sand', featured: false },
  { id: 'sample-ssd-01', name: 'Pulse 1TB NVMe Solid State Drive', brand: 'Concept Storage', category: 'components', description: 'A sleek high-speed NVMe SSD concept for gaming rigs and everyday workloads.', priceINR: 4999, compareAtINR: 5999, art: 'ssd', tone: 'mint', featured: false },
  { id: 'sample-gpu-01', name: 'Forge Dual-Fan Graphics Card', brand: 'Concept Graphics', category: 'components', description: 'A dual-fan graphics card concept showcasing hardware-led product detail layouts.', priceINR: 28999, compareAtINR: 33999, art: 'gpu', tone: 'stone', featured: false },
  { id: 'sample-laptop-01', name: 'Aero 14 Everyday Laptop', brand: 'Concept Computing', category: 'laptops', description: 'An elegant thin-and-light laptop presentation for work, study and creative tasks.', priceINR: 48999, compareAtINR: 54999, art: 'laptop', tone: 'ice', featured: false },
  { id: 'sample-mic-01', name: 'Cast USB Desktop Microphone', brand: 'Concept Audio', category: 'audio', description: 'A clean desktop USB microphone concept for calls, streams and recordings.', priceINR: 3199, compareAtINR: 4299, art: 'mic', tone: 'sand', featured: false },
  { id: 'sample-deskmat-01', name: 'Terrain XL Desk Mat', brand: 'Concept Accessories', category: 'accessories', description: 'A spacious desk mat with a quiet minimalist look and smooth working surface.', priceINR: 899, compareAtINR: 1299, art: 'deskmat', tone: 'rose', featured: false },
  { id: 'sample-tower-01', name: 'Core Airflow PC Cabinet', brand: 'Concept Hardware', category: 'components', description: 'A modern tempered-glass cabinet layout with cool airflow and tidy internal space.', priceINR: 4499, compareAtINR: 5499, art: 'tower', tone: 'ice', featured: false },
  { id: 'sample-pc-01', name: 'Studio Build — Custom Desktop', brand: 'BNB Concept Build', category: 'custom-pcs', description: 'A custom PC build visual concept; final parts and pricing require a bespoke quotation.', priceINR: null, compareAtINR: null, art: 'pc', tone: 'stone', featured: true },
  { id: 'sample-cpu-01', name: 'Core Performance Processor', brand: 'Concept Components', category: 'components', description: 'A desktop processor concept for exploring component specifications and comparisons.', priceINR: 13999, compareAtINR: 15999, art: 'cpu', tone: 'mint', featured: false }
];

export const categoryName = (id) => storeCategories.find((item) => item.id === id)?.name || 'Tech';
export const rupees = (value) => Number.isFinite(value)
  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
  : 'Price on request';

export const normalizeStoreProduct = (product) => ({
  ...product,
  id: String(product._id || product.id),
  art: product.art || (product.category === 'components' ? 'gpu' : product.category === 'custom-pcs' ? 'pc' : product.category === 'audio' ? 'headphones' : product.category === 'accessories' ? 'deskmat' : product.category === 'laptops' ? 'laptop' : product.category === 'keyboards' ? 'keyboard' : product.category === 'mice' ? 'mouse' : product.category === 'monitors' ? 'monitor' : 'gpu'),
  tone: product.tone || 'stone',
  isDemo: !product._id,
  mode: product.mode || 'showcase'
});
