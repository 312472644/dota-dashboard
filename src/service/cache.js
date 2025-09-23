import axios from 'axios';

const flatItems = data => {
  const dataList = [];
  for (const [key, value] of Object.entries(data)) {
    dataList.push(...value.map(item => item.items));
  }
  return dataList.flat(Infinity);
};
const cacheData = async () => {
  const cacheHeroList = localStorage.getItem('heroList');
  if (!cacheHeroList) {
    // 防止接口多次调用
    localStorage.setItem('heroList', 'loading');
    // 缓存中文英雄列表
    const heroes = await axios.get('https://www.dota2.com.cn/datafeed/heroList?task=herolist');
    // 缓存中文物品列表
    const items = await axios.get('https://www.dota2.com.cn/itemscategory/json');
    localStorage.setItem('itemList', JSON.stringify(flatItems(items.data.result || [])));
    localStorage.setItem('heroList', JSON.stringify(heroes.data.result.heroes || []));
  }
};

export { cacheData };
