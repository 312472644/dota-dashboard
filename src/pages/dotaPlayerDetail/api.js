import service from '@/service';

const getPlayerAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}?`
  });
};

const getPlaterWlAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/wl`
  });
};

// 玩家最近游戏数据
const getRecentMatchesAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/recentMatches?`
  });
};

// 玩家最近玩家列表
const getPeersAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/peers?`
  });
};

// 玩家最近玩家列表
const getHeroesAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/heroes?`
  });
};

const getPlayerCountAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/counts?`
  });
};

const getAllMatchAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/matches?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=start_time&project=version&project=kills&project=deaths&project=assists&project=skill&project=leaver_status&project=party_size&project=average_rank&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5&project=backpack_0`
  });
};

const getRecordListAPI = (accountId, sort) => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/matches`,
    params: {
      sort,
      limit: 20
    }
  });
};

const getTotalsAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/totals?`
  });
};

const getRatingsAPI = accountId => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/ratings?`
  });
};

const getHistogramsAPI = (accountId, type = 'kills') => {
  return service({
    url: `https://api.opendota.com/api/players/${accountId}/histograms/${type}?`
  });
};

export {
  getPlayerAPI,
  getPlaterWlAPI,
  getRecentMatchesAPI,
  getPeersAPI,
  getHeroesAPI,
  getPlayerCountAPI,
  getAllMatchAPI,
  getRecordListAPI,
  getTotalsAPI,
  getRatingsAPI,
  getHistogramsAPI
};
