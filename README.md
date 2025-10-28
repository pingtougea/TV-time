# 电影搜索与发现应用

一个现代化的电影探索平台，帮助用户轻松发现、搜索和收藏喜爱的电影。应用集成了 TMDB 电影数据库，提供丰富的电影信息和流畅的用户体验。

## 功能特点

- **电影搜索**：实时搜索电影，支持搜索历史记录
- **电影详情**：查看电影的详细信息，包括剧情简介、评分、演员等
- **收藏功能**：将喜爱的电影加入收藏，本地存储
- **趋势电影**：展示热门搜索的电影榜单
- **多维度排序**：支持按热度、评分和上映时间排序
- **响应式设计**：适配各种屏幕尺寸的设备

## 技术栈

- **前端框架**：React 18
- **UI 组件库**：Ant Design
- **样式解决方案**：Tailwind CSS
- **电影数据**：TMDB API
- **后端服务**：Appwrite（用于存储搜索统计）
- **状态管理**：React Hooks
- **构建工具**：Vite

## 安装与配置

### 前提条件

- Node.js 14+
- npm 或 yarn
- TMDB API 密钥（可从[TMDB 官网](https://www.themoviedb.org/)获取）
- Appwrite 账户及项目配置

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/pingtougea/TV-time.git
cd movie-search-app
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 配置环境变量

在项目根目录创建`.env`文件，添加以下配置：

```
VITE_TMDB_API_KEY=你的TMDB API密钥
VITE_APPWRITE_PROJECT_ID=你的Appwrite项目ID
VITE_APPWRITE_DATABASE_ID=你的Appwrite数据库ID
VITE_APPWRITE_TABLE_ID=你的Appwrite表ID
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

5. 访问应用

打开浏览器，访问`http://localhost:5173`（默认端口）

## 使用说明

1. **搜索电影**：在顶部搜索栏输入电影名称，实时获取搜索结果
2. **查看详情**：点击电影卡片查看详细信息
3. **收藏电影**：点击电影卡片上的爱心图标添加/移除收藏
4. **排序电影**：使用右上角的下拉菜单选择排序方式
5. **查看趋势**：浏览页面上方的趋势电影榜单
6. **搜索历史**：查看和管理你的搜索历史记录

## 项目结构

```
src/
├── component/       #  UI组件
│   ├── MovieCard.jsx      # 电影卡片组件
│   ├── SearchBar.jsx      # 搜索栏组件
│   ├── MovieDetailModal.jsx # 电影详情弹窗
│   └── Spinner.jsx        # 加载指示器
├── services/        # 服务与API调用
│   └── tmdb.js      # TMDB API封装
├── appwrite.js      # Appwrite服务配置
├── App.jsx          # 应用主组件
├── main.jsx         # 入口文件
└── index.css        # 全局样式
```

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 致谢

- [TMDB](https://www.themoviedb.org/) 提供电影数据
- [Appwrite](https://appwrite.io/) 提供后端服务支持
- [Ant Design](https://ant.design/) 提供 UI 组件
- [Tailwind CSS](https://tailwindcss.com/) 提供样式解决方案
