# 🚀 ClawdTM 部署指南

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
访问：http://localhost:3000

## 生产部署

### 选项1：Vercel（推荐）
1. Fork 这个仓库到你的GitHub账户
2. 访问 https://vercel.com
3. 用GitHub登录
4. 点击 "New Project"
5. 选择你的仓库
6. 点击 "Deploy"

### 选项2：Netlify
1. 访问 https://netlify.com
2. 拖拽 `dist` 文件夹到部署区域
3. 或连接GitHub仓库自动部署

### 选项3：GitHub Pages
1. 在仓库设置中启用 GitHub Pages
2. 选择 "main" 分支和 "/ (root)" 文件夹
3. 访问：https://yourusername.github.io/Moltbot

## 功能特性

✅ **响应式设计** - 支持桌面和移动端  
✅ **深色模式** - 自动适配系统主题  
✅ **搜索功能** - 实时搜索技能  
✅ **技能安装** - 模拟安装流程  
✅ **分类浏览** - 按类别查看技能  

## 数据源

当前使用模拟数据。要连接真实数据源：

1. 设置Supabase数据库
2. 执行 `supabase-schema.sql`
3. 配置环境变量
4. 更新API调用

## 环境变量

创建 `.env` 文件：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```