# Product Generate Fragments

[![Next.js Version](https://img.shields.io/badge/Next.js-14.2.3-blue)](https://nextjs.org/)
[![Google AI SDK](https://img.shields.io/badge/Google%20AI%20SDK-0.3.0-green)](https://ai.google.dev/)

基于 Google Gemini 1.5 Fast 模型和 Next.js 构建的产品描述片段生成工具，帮助用户快速生成高质量的产品营销文案。

## ✨ 主要功能

- **AI 智能生成**：集成 Google Gemini 1.5 Fast 模型生成电商详情页
- **实时预览**：即时渲染生成的 网站 内容
- **内容微调**：支持调整生成的网站的细节
- **历史记录**：自动保存最近生成的项目记录

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **AI 引擎**: Google Generative AI SDK
- **UI 组件**: antd/ui
- **样式**: Tailwind CSS
- **代码规范**: ESLint + Prettier

## 🚀 快速开始

### 前置要求
- Node.js 18+
- Google API 密钥（[申请地址](https://makersuite.google.com/app/apikey)）

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/Arthus-wyk/fragment-of-productDetail.git
```
2. 安装依赖
```bash
npm install
# 或
yarn install
```
3. 创建环境文件
```bash
cp .env.example .env.local
```
配置API密钥（在.env.local中添加）：
```bash
# Google API Key
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyA2hUDY0GIhVKP4OubPOyKHIEdXtJeGokc
#supabase url & key
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
#qiniu 
QINIU_ACCESS_KEY=
QINIU_SECRET_KEY=
QINIU_BUCKET=
```

启动开发服务器
```bash
npm run dev
# 或
yarn dev
```
🖥️ 使用说明
在工具栏选择想要生成的内容
在输入框输入想要微调的内容（支持中英文）

🤝 贡献指南
欢迎提交 Issue 和 PR！贡献前请阅读：

Fork 仓库
创建特性分支 (git checkout -b feature/AmazingFeature)
提交修改 (git commit -m 'Add some AmazingFeature')
推送到分支 (git push origin feature/AmazingFeature)
发起 Pull Request
📄 许可证
本项目采用 MIT License

提示：生成内容需遵守Google AI使用条款，请勿用于生成违法或侵权内容。

Made with ❤️ by Arthus-wyk | Demo