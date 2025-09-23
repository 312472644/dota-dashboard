import service from '@/service';

// 获取赛事列表
const getScheduleMatchListAPI = eventId => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getScheduleMatchList?eventId=${eventId}`
  });
};

// 获取赛事参赛队伍
const getEventSummaryAPI = eventId => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getEventSummary?eventId=${eventId}`
  });
};

// 获取赛事榜单信息
const getHeroesWinRateAPI = eventId => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getHerosWinRate?eventId=${eventId}`
  });
};

const getTeamListAPI = () => {
  return service({
    url: 'https://api.opendota.com/api/teams'
  });
};

const getTeamInfoByMatchIdAPI = matchId => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getTeamInfoByMatchId?matchId=${matchId}`
  });
};

// 获取真实的比赛Id
const getSteamIdByNidAPI = nid => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getSteamIdByNid?nid=${nid}&type=5`
  });
};

// 获取英雄缩略图
const getHeroIconAPI = matchId => {
  return service({
    url: `https://gwapi.pwesports.cn/eventcenter/app/dota/match/detail?matchId=${matchId}`
  });
};

const getRankInfoAPI = eventId => {
  return service({
    url: `https://appengine.wmpvp.com/dota/event/getRankInfo?eventId=${eventId}`
  });
};

export {
  getScheduleMatchListAPI,
  getEventSummaryAPI,
  getHeroesWinRateAPI,
  getTeamListAPI,
  getTeamInfoByMatchIdAPI,
  getSteamIdByNidAPI,
  getHeroIconAPI,
  getRankInfoAPI
};
