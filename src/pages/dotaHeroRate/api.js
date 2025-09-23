import service from '@/service';

const getHeroStatsAPI = () => {
  return service({
    url: 'https://api.opendota.com/api/heroStats?'
  });
};

export { getHeroStatsAPI };
