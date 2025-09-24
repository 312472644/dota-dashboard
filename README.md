# 🎮 IDota Game - DOTA2 数据分析平台

[![Deploy Status](https://github.com/312472644/dota-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/312472644/dota-dashboard/actions/workflows/deploy.yml)
[![Vue](https://img.shields.io/badge/Vue-3.2.41-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-3.2.3-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一个基于 Vue 3 + Vite 构建的 DOTA2 数据分析平台，提供英雄数据、比赛信息、排行榜等功能。

## 📋 项目简介

Dota Dashboard 是一个专为 DOTA2 玩家打造的数据分析平台，集成了丰富的游戏数据和统计功能：

- 🏆 **排行榜系统** - 实时查看玩家天梯排名
- 🎯 **英雄数据分析** - 详细的英雄属性、技能和统计信息
- ⚔️ **比赛数据** - 比赛详情、队伍信息和赛事分析
- 📊 **数据可视化** - 图表展示游戏统计数据
- 🔍 **智能搜索** - 快速查找玩家、队伍和比赛信息

## 🚀 在线预览

🌐 [访问线上地址](https://312472644.github.io/dota-dashboard/#/dota-data)

## 🛠️ 技术栈

### 前端技术
- **框架**: Vue 3.2.41 (Composition API + `<script setup>`)
- **构建工具**: Vite 3.2.3
- **路由**: Vue Router 4.0.15
- **UI组件库**: View UI Plus 1.3.1
- **样式**: SCSS + 响应式设计
- **图表**: Highcharts 10.3.1
- **HTTP客户端**: Axios 1.2.0
- **工具库**: Lodash 4.17.21、Day.js 1.11.6

### 中间件服务
- **后端框架**: Koa 2.13.4
- **路由**: Koa Router 12.0.0
- **代理请求**: koa2-request 1.0.4
- **功能**: API代理服务，解决跨域问题

### 开发工具
- **代码规范**: ESLint + Prettier
- **包管理**: npm
- **部署**: GitHub Actions + GitHub Pages

## 📦 项目结构

```
IDota-game/
├── 📁 src/                    # 源代码目录
│   ├── 📁 components/         # 通用组件
│   │   ├── Anchor/           # 锚点组件
│   │   ├── BoardRank/        # 排行榜组件
│   │   ├── Empty/            # 空状态组件
│   │   └── ...               # 其他组件
│   ├── 📁 pages/             # 页面组件
│   │   ├── dotaAllRank/      # 全部排行榜
│   │   ├── dotaHero/         # 英雄列表
│   │   ├── dotaTeam/         # 队伍信息
│   │   └── ...               # 其他页面
│   ├── 📁 layout/            # 布局组件
│   ├── 📁 hooks/             # 自定义 Hooks
│   ├── 📁 service/           # API 服务
│   ├── 📁 utils/             # 工具函数
│   └── 📁 assets/            # 静态资源
├── 📁 middleware/            # 后端中间件
│   ├── app.js               # Koa 应用入口
│   ├── proxy.js             # API 代理配置
│   └── package.json         # 中间件依赖
├── 📁 .github/workflows/     # GitHub Actions
│   └── deploy.yml           # 自动部署配置
└── 📄 README.md             # 项目文档
```

## ⚡ 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/312472644/dota-dashboard.git

# 进入项目目录
cd dota-dashboard

# 安装前端依赖
npm install

# 安装中间件依赖
cd middleware
npm install
cd ..
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动中间件服务 (新终端窗口)
cd middleware
npm run serve
```

访问 `http://localhost:5173` 查看应用

### 生产构建

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 🔧 核心功能

### 1. 排行榜系统
- 实时获取 DOTA2 天梯排名数据
- 支持分页查看和搜索功能
- 显示玩家详细信息和排名变化

### 2. 英雄数据库
- 完整的英雄属性和技能信息
- 英雄胜率和选取率统计
- 推荐出装和天赋加点

### 3. 比赛分析
- 比赛详情和数据统计
- 队伍信息和历史战绩
- 赛事日程和结果

### 4. 数据可视化
- 使用 Highcharts 展示统计图表
- 响应式图表设计
- 交互式数据展示

## 🌐 API 代理服务

项目使用 Koa 中间件提供 API 代理服务，主要功能：

### 跨域处理
```javascript
// 设置 CORS 头部
ctx.set('Access-Control-Allow-Origin', '*');
```

### API 代理
```javascript
// 代理 DOTA2 API 请求
router.get('/getRankList', async (ctx, next) => {
  const response = await koa2Req(`https://api.maxjia.com/api/player/ladder/?${params}`);
  ctx.body = response.body;
});
```

## 🚀 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages：

### 部署流程
1. **代码检出** - 获取最新代码
2. **环境设置** - 配置 Node.js 环境
3. **依赖安装** - 安装 npm 依赖
4. **项目构建** - 执行 Vite 构建
5. **部署发布** - 部署到 GitHub Pages

### 手动部署
```bash
# 构建项目
npm run build

# 部署到 GitHub Pages
# (需要配置 GitHub Pages 设置)
```

## 🎨 UI 组件

基于 View UI Plus 构建，包含：
- 表格组件 (数据展示)
- 分页组件 (数据分页)
- 模态框组件 (详情展示)
- 加载组件 (状态反馈)
- 搜索组件 (数据检索)

## 🔍 开发建议

### 推荐 IDE 配置
- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 语言支持
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 代码规范检查

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 联系方式

- 作者: [312472644](https://github.com/312472644)
- 问题反馈: [Issues](https://github.com/312472644/IDota-game/issues)

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [View UI Plus](https://www.iviewui.com/) - Vue 3 UI 组件库
- [Highcharts](https://www.highcharts.com/) - 图表库
- [DOTA2 API](https://api.maxjia.com/) - 数据源

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
