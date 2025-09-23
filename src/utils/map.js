import agile from '@/assets/images/agile.png';
import intelligence from '@/assets/images/intelligence.png';
import strong from '@/assets/images/strong.png';

// 英雄属性
const heroMap = {
  0: { primaryAttrName: '力量', primaryAttrLogo: strong },
  1: { primaryAttrName: '敏捷', primaryAttrLogo: agile },
  2: { primaryAttrName: '智力', primaryAttrLogo: intelligence },
  3: { primaryAttrName: '力量', primaryAttrLogo: strong }
};

// 天梯段位
const rankTierMap = new Map();
rankTierMap.set(10, '先锋');
rankTierMap.set(20, '卫士');
rankTierMap.set(30, '中军');
rankTierMap.set(40, '统帅');
rankTierMap.set(50, '传奇');
rankTierMap.set(60, '万古流芳');
rankTierMap.set(70, '超凡入圣');
rankTierMap.set(80, '冠绝一世');

// 游戏模式
const gameModeMap = new Map();
gameModeMap.set(0, '未知');
gameModeMap.set(1, '全英雄选择');
gameModeMap.set(2, '队长模式');
gameModeMap.set(3, '随机征召');
gameModeMap.set(4, '单一征召');
gameModeMap.set(5, '全英雄随机');
gameModeMap.set(6, '开局');
gameModeMap.set(7, '夜魇暗潮');
gameModeMap.set(8, '反队长模式');
gameModeMap.set(9, '小贪魔节');
gameModeMap.set(10, '教程');
gameModeMap.set(11, '单中模式');
gameModeMap.set(12, '生疏模式');
gameModeMap.set(13, '英雄限定');
gameModeMap.set(14, '勇士令状');
gameModeMap.set(15, '自定义游戏');
gameModeMap.set(16, '队长征召');
gameModeMap.set(17, '平衡征召');
gameModeMap.set(18, '技能征召');
gameModeMap.set(19, '活动');
gameModeMap.set(20, '全随机死亡竞赛模式');
gameModeMap.set(21, '1v1 中路 solo');
gameModeMap.set(22, '全英雄选择(BP)');
gameModeMap.set(23, '加速模式');
gameModeMap.set(24, '突变');

// 游戏类型
const lobbyTypeMap = new Map();
lobbyTypeMap.set(0, '普通');
lobbyTypeMap.set(1, '练习赛');
lobbyTypeMap.set(2, '锦标赛');
lobbyTypeMap.set(3, '教程');
lobbyTypeMap.set(4, '合作对抗机器人');
lobbyTypeMap.set(5, '天梯组队匹配');
lobbyTypeMap.set(6, '天梯单排');
lobbyTypeMap.set(7, '天梯');
lobbyTypeMap.set(8, '中路对单');
lobbyTypeMap.set(9, '勇士联赛');

// 位置角色
const laneRoleMap = new Map();
laneRoleMap.set(0, '未知');
laneRoleMap.set(1, '优势路');
laneRoleMap.set(2, '中路');
laneRoleMap.set(3, '劣势路');
laneRoleMap.set(4, '辅助');
laneRoleMap.set(5, '纯辅助');

// 游戏等级
const gameLevelMap = new Map();
gameLevelMap.set(0, '未知等级');
gameLevelMap.set(1, 'Normal');
gameLevelMap.set(2, 'High');
gameLevelMap.set(3, 'Very Hig');

export { heroMap, rankTierMap, gameModeMap, lobbyTypeMap, laneRoleMap, gameLevelMap };
