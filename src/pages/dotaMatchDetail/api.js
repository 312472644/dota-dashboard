import service from '@/service';

const getMatchAPI = matchId => {
  return service({
    url: `https://api.opendota.com/api/matches/${matchId}?`
  });
};

const getHeroDetailAPI = heroId => {
  return service({
    url: `https://www.dota2.com.cn/datafeed/hero?hero_id=${heroId}`
  });
};

const getJobIdAPI = matchId => {
  return service({
    url: `https://api.opendota.com/api/request/${matchId}`,
    method: 'POST'
  });
};

const requestAPI = jobId => {
  return service({
    url: `https://api.opendota.com/api/request/${jobId}`
  });
};

export { getMatchAPI, getHeroDetailAPI, getJobIdAPI, requestAPI };
