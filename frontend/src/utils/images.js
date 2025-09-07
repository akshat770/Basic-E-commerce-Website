const categoryKeywordMap = {
  Electronics: 'electronics gadgets tech device',
  Sports: 'sports fitness gear',
  Appliances: 'kitchen appliance home',
  Furniture: 'furniture interior home',
  Office: 'office stationery workspace',
  Fashion: 'fashion clothes style',
};

const cache = new Map();

// Specific item → curated Pexels image (no API key required)
const specificImageRules = [
  { match: /laptop/i, url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600' },
  { match: /headphone|headset/i, url: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /speaker/i, url: 'https://images.pexels.com/photos/33797083/pexels-photo-33797083.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /coffee\s?maker|coffee/i, url: 'https://images.pexels.com/photos/593328/pexels-photo-593328.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /running\s?shoes|shoes|sneaker/i, url: 'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /yoga\s?mat/i, url: 'https://images.pexels.com/photos/6740756/pexels-photo-6740756.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /water\s?bottle/i, url: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /phone\s?case/i, url: 'https://images.pexels.com/photos/696645/pexels-photo-696645.jpeg' },
  { match: /watch/i, url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /backpack|bag/i, url: 'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /notebook|journal/i, url: 'https://images.pexels.com/photos/159682/spring-notebook-book-perspective-159682.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { match: /lamp|desk\s?lamp/i, url: 'https://images.pexels.com/photos/2168382/pexels-photo-2168382.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export const fetchPexelsImage = async (query) => {
  if (cache.has(query)) return cache.get(query);
  const apiKey = import.meta?.env?.VITE_PEXELS_API_KEY || localStorage.getItem('PEXELS_API_KEY');
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?per_page=1&query=${encodeURIComponent(query)}`, {
      headers: { Authorization: apiKey }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const url = data?.photos?.[0]?.src?.medium || data?.photos?.[0]?.src?.landscape || null;
    cache.set(query, url);
    return url;
  } catch (_) {
    return null;
  }
};

export const getItemImageUrl = (item) => {
  if (item?.image) return item.image; // use backend-provided image if available
  const name = item?.name || '';
  const category = item?.category || '';
  // Try curated rules first
  for (const rule of specificImageRules) {
    if (rule.match.test(name)) return rule.url;
  }
  // Category-based nice photos
  const categoryFallbacks = {
    Electronics: 'https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=600',
    Sports: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
    Appliances: 'https://images.pexels.com/photos/1209778/pexels-photo-1209778.jpeg?auto=compress&cs=tinysrgb&w=600',
    Furniture: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    Office: 'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=600',
    Fashion: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600',
  };
  if (categoryFallbacks[category]) return categoryFallbacks[category];
  // Generic fallback
  return 'https://images.pexels.com/photos/7156883/pexels-photo-7156883.jpeg?auto=compress&cs=tinysrgb&w=600';
};

