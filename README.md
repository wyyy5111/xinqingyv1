# 心晴屿 · 心理健康监测平台

> 一个基于 React + Vite 的单页应用（SPA），用于情绪记录、数据分析、实时监测与自我调节展示。当前版本为前端演示版，未接入后端服务。

## 功能概览

- 情绪日志：记录情绪、活动、天气与强度，支持统计概览与历史条目
- 数据分析：情绪分析、注意力分析、专业报告，包含折线/柱状/雷达等图表
- 实时监测：模拟展示生理或心理指标的实时曲线与状态卡片
- 调节模块：情绪音乐、情绪云、心灵交响、感知治疗等交互页面
- 历史与日历：历史记录浏览与日历视图（react-calendar）
- 桑基/词云：项目中通过自定义 DOM 实现词云环形布局（未启用 react-wordcloud）
- 访问控制：登录后访问受保护路由，未登录自动跳转登录页

## 技术栈

- 前端框架：React 18
- 路由：`react-router-dom@^6`（`BrowserRouter` + 受保护路由）
- 构建工具：Vite 5 + `@vitejs/plugin-react`
- 可视化：Chart.js 4 + `react-chartjs-2`
- 日历组件：`react-calendar`
- 样式：页面级与组件级 CSS 文件
- 认证：自定义 `AuthContext`（本地存储 + 受保护路由）

> 依赖中存在但当前未实际使用：`styled-components`、`axios`、`three`、`@react-three/fiber`、`@react-three/drei`、`react-wordcloud`。

## 项目结构

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                # 应用入口（ReactDOM + BrowserRouter）
│   ├── App.jsx                 # 路由与页面骨架、受保护路由
│   ├── App.css                 # 全局样式与背景
│   ├── core/contexts/AuthContext.jsx  # 认证上下文、模拟登录/注册
│   ├── ui/components/          # 底部导航、公共组件
│   ├── ui/pages/               # 各功能页面（日志/分析/监测/治疗/档案等）
│   ├── assets/                 # 图片与公共 CSS
│   ├── analysis/ drivers/ models/ services/ therapy/ utils/ visualization/
│   │   # 以上目录当前为空，用于后续扩展（算法、设备、模型、服务等）
```

## 快速开始

- 环境要求：Node.js ≥ 18
- 安装依赖：

  ```bash
  npm install
  ```

- 启动开发服务器：

  ```bash
  npm run dev
  ```

  终端会输出本地地址（通常为 `http://localhost:5173`），浏览器打开即可。

- 生产构建与预览：

  ```bash
  npm run build
  npm run preview
  ```

- 代码检查：

  ```bash
  npm run lint
  ```

## 路由与访问控制

- 公开路由：`/`（欢迎）、`/login`（登录）、`/register`（注册）
- 受保护路由（登录后可访问）：
  - 日志：`/journal`
  - 记录：`/record`、`/real-time-monitoring`、`/history-records`
  - 分析：`/analysis`、`/emotion-analysis`、`/attention-analysis`、`/brain-computer-interface`、`/professional-report`
  - 调节：`/therapy`、`/emotion-music`、`/emotion-cloud`、`/mind-symphony`、`/perceptual-therapy`
  - 我的：`/my-profile`
  - 其他流程页：`/consent-form`、`/user-classification`
- 认证逻辑：
  - 使用 `AuthContext` 管理 `isAuthenticated`、`userInfo`、`token`（保存在 `localStorage`）
  - `ProtectedRoute` 未认证则重定向到 `/login`
  - 登录成功默认进入 `/journal`

## 数据与可视化

- 图表：全站通过 `react-chartjs-2` + `chart.js` 渲染折线、柱状、雷达、散点等
- 词云：在 `EmotionAnalysisPage.jsx` 中以自定义布局实现圆形环绕词云（`react-wordcloud` 处于注释状态）
- 实时监测与脑机接口：页面展示的数值由前端模拟，不依赖后端接口
- 网络请求：当前未检索到 `axios` 或 `fetch` 的实际调用；`src/services/` 为空

## 部署指南

> 你可以选择 GitHub Pages（推荐）或 Vercel/Netlify 进行部署。

### 方案 A：GitHub Pages（最简）

1. 新建 GitHub 仓库（建议英文仓库名）。
2. 将代码推送到 `main` 分支。
3. 路由选择：
   - 最省事：将 `BrowserRouter` 改为 `HashRouter`（链接形如 `/#/journal`），无需服务端回退。
   - 若保留 `BrowserRouter`：需要添加 `public/404.html` 进行 SPA 回退，否则直接访问子路由会 404。
4. 配置 Vite 基础路径：
   - 用户主页仓库（`<用户名>.github.io`）：`vite.config.js` 的 `base` 保持为 `'/'`（默认即可）。
   - 项目页（`<用户名>.github.io/<仓库名>`）：将 `base` 设置为 `'/<仓库名>/'`。

   示例 `vite.config.js`：

   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     base: '/<仓库名>/',
     plugins: [react()],
   })
   ```

5. 启用自动部署：在仓库中新建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ "main" ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: true

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

6. 仓库 Settings → Pages，将 Source 选择为 “GitHub Actions”。完成后访问：
   - 用户主页：`https://<用户名>.github.io/`
   - 项目页：`https://<用户名>.github.io/<仓库名>/`

### 方案 B：Vercel / Netlify（零配置）

- 连接 GitHub 仓库后，平台会自动识别 Vite 项目：
  - Build Command：`npm run build`
  - Output Directory：`dist`
- 支持 SPA 回退（`BrowserRouter` 无需改动）。
- 部署完成即获得访问链接，可绑定自定义域名。

## 配置与环境

- `.gitignore` 已包含常见 Node.js 排除项与 `.env*` 忽略；如需集成后端或第三方服务，可在根目录添加 `.env` 并在 Vite 中引用。
- GitHub Pages 绑定自定义域名时，可在 `public/` 添加 `CNAME` 文件并设置 Vite `base: '/'`。

## 目录说明（待扩展）

- `src/services/`：后端 API 封装层（当前为空）
- `src/drivers/`：设备或数据源适配层（当前为空）
- `src/analysis/`：算法与统计分析（当前为空）
- `src/models/`：数据模型与类型定义（当前为空）
- `src/therapy/`：治疗逻辑与内容（当前为空）
- `src/utils/`：通用工具方法（当前为空）
- `src/visualization/`：通用可视化组件或工具（当前为空）

## 常见问题（FAQ）

- 访问子路由 404：GitHub Pages 无服务端回退，使用 `HashRouter` 或添加 `public/404.html` 实现 SPA 回退。
- 页面路径前缀错乱：确认 `vite.config.js` 的 `base` 与仓库发布路径一致（项目页需 `'/<仓库名>/'`）。
- Node 版本：使用 Node.js 18 或更高版本；过低版本可能导致依赖安装失败或 Vite 无法运行。

## 贡献与开发规范

- 欢迎提交 Issue 与 Pull Request。
- 建议遵循简洁、可读的代码风格；避免在无后端的演示版本中引入不必要复杂度。

## 许可证

- 当前未设置开源许可证，如需开放或商用请根据需要添加许可协议（例如 MIT、Apache-2.0 等）。

---

如需我直接将路由改为 `HashRouter` 并添加 GitHub Actions 工作流文件，或保留 `BrowserRouter` 并补充 `404.html` 与 `base` 配置，请告知你的仓库类型（用户主页或项目页）与偏好，我可以为你自动完成配置。