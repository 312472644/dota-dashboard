import service from '@/service';

// 获取英雄详情
const getHeroDetailAPI = heroId => {
  return service({
    url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`
  });
};

// 英雄玩家排名
const getRankListAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/rankings?hero_id=${heroId}`
  });
};

const getBenchMarksAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/benchmarks?hero_id=${heroId}`
  });
};

const getRecentListAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/heroes/${heroId}/matches`
  });
};

const getHeroMatchUpsAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/heroes/${heroId}/matchups`
  });
};

const getPlayersAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/heroes/${heroId}/players?`
  });
};

const getItemPopularityAPI = heroId => {
  return service({
    url: `https://api.opendota.com/api/heroes/${heroId}/itemPopularity?`
  });
};

export {
  getHeroDetailAPI,
  getRankListAPI,
  getBenchMarksAPI,
  getRecentListAPI,
  getHeroMatchUpsAPI,
  getPlayersAPI,
  getItemPopularityAPI
};
