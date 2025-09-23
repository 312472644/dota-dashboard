// 该文件放置的都是跨域请求，需求启动middleware文件中app.js服务
import service from './index';

const mode = import.meta.env.VITE_MODE;
const BASE_URL = mode === 'production' ? 'http://124.70.218.140:3000' : 'http://localhost:3000';

// 获取天梯排名
const getRankListAPI = (division = 'china') => {
  return service({
    url: `${BASE_URL}/getRankList`,
    params: {
      division,
      game_type: 'dota2'
    }
  });
};

export { getRankListAPI };
