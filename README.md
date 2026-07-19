# eap-frontend

企业架构平台（Enterprise Architecture Platform）前端项目。

## 项目简介

EAP Frontend 是一个基于 React + Vite + TypeScript 构建的企业架构平台前端应用，用于管理企业架构中的价值流、业务能力和业务流程等核心组件。

## 技术栈

- **框架**: React 19
- **构建工具**: Vite 8
- **语言**: TypeScript 6
- **UI 组件**: Radix UI (shadcn/ui) + Tailwind CSS 4
- **状态管理**: Zustand + Apollo Client (GraphQL)
- **路由**: React Router v7
- **表单**: React Hook Form + Zod
- **测试**: Playwright
- **代码检查**: oxlint

## 本地运行

### 环境要求

- Node.js >= 18
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`。

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

## 构建 Docker 镜像

### 本地构建

```bash
docker build -t eap-frontend:latest .
```

如需指定 API 地址，可通过构建参数传入：

```bash
docker build --build-arg VITE_API_URL=https://api.prod.com -t eap-frontend:latest .
```

### 运行容器

```bash
docker run -p 80:80 eap-frontend:latest
```

### CI/CD 自动构建

项目通过 GitHub Actions / Gitee Workflows 自动构建并推送 Docker 镜像：

- **GitHub**: 推送到 `main` 分支时，自动构建并推送到 GitHub Container Registry (ghcr.io)
- **Gitee**: 推送到 `master` 分支时，自动构建并推送到华为云 SWR

## 项目结构

```
src/
├── api/          # API 请求封装
├── components/    # 通用组件 (ui 基础组件)
├── lib/           # 工具库
├── router/        # 路由配置
├── stores/        # Zustand 状态管理
└── App.tsx        # 应用入口
```

## 参与贡献

1. Fork 本仓库
2. 新建 `Feat_xxx` 分支
3. 提交代码
4. 创建 Pull Request

## 许可证

私有项目，版权所有。
