# 🔧 Supabase 设置指南

## 📋 Supabase 是什么？

**Supabase** 是一个开源的Firebase替代品，为你的ClawdTM项目提供：
- ✅ **PostgreSQL数据库** - 存储技能、用户、分类数据
- ✅ **实时功能** - 实时更新技能状态
- ✅ **身份认证** - 用户注册登录系统
- ✅ **自动API** - 自动生成REST API

## 🚀 快速开始

### 1. 创建Supabase项目

1. 访问 [supabase.com](https://supabase.com)
2. 注册/登录账户
3. 点击 "New Project"
4. 填写项目信息：
   - **Name**: `clawdtm` (或其他名称)
   - **Database Password**: 设置安全密码
   - **Region**: 选择离你最近的区域
5. 点击 "Create new project"

### 2. 获取连接信息

项目创建后，在设置页面找到：
- **Project URL** (类似: `https://abc123.supabase.co`)
- **API Key** (anon public key)

### 3. 配置环境变量

创建 `.env` 文件：
```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的API密钥
```

### 4. 初始化数据库

在Supabase的SQL编辑器中执行 `supabase-schema.sql` 文件的内容。

## 📊 数据库结构

项目包含以下表：

### `users` - 用户表
- 用户基本信息
- 社交媒体链接
- 个人资料

### `categories` - 分类表
- 技能分类
- 图标和颜色配置

### `skills` - 技能表
- 技能详细信息
- 评分和评论数
- 关联分类和作者

### `user_skills` - 用户技能关系
- 记录用户安装的技能
- 安装时间戳

## 🔄 数据迁移

### 从模拟数据迁移

项目会自动检测Supabase配置：
- **有配置**: 使用真实的Supabase数据
- **无配置**: 使用内置的模拟数据

### 插入示例数据

执行以下SQL插入示例数据：

```sql
-- 插入分类
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Search', 'search', 'Web search and information retrieval', 'fas fa-search', '#3B82F6'),
('Development', 'development', 'Coding and software development tools', 'fas fa-code', '#10B981'),
('Creative', 'creative', 'Design and creative applications', 'fas fa-image', '#8B5CF6'),
('Data', 'data', 'Database and data management', 'fas fa-database', '#F59E0B'),
('Analytics', 'analytics', 'Data analysis and visualization', 'fas fa-chart-bar', '#EF4444'),
('AI Tools', 'ai-tools', 'Artificial intelligence applications', 'fas fa-robot', '#6B7280');

-- 插入示例技能（需要先有用户和分类）
```

## 🔒 安全设置

### 行级安全 (RLS)

Supabase默认启用行级安全。确保为每个表设置适当的策略：

```sql
-- 允许公开读取技能
CREATE POLICY "Skills are viewable by everyone" ON skills
FOR SELECT USING (true);

-- 只允许认证用户安装技能
CREATE POLICY "Users can install their own skills" ON user_skills
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🌐 部署注意事项

### Vercel部署

在Vercel项目设置中添加环境变量：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify部署

在Netlify的站点设置中添加环境变量。

## 🐛 故障排除

### 常见问题

1. **连接错误**
   - 检查环境变量是否正确
   - 确认Supabase项目是否运行中

2. **权限错误**
   - 检查RLS策略设置
   - 确认API密钥权限

3. **数据不显示**
   - 检查数据库表是否存在
   - 确认数据插入成功

### 调试模式

在浏览器控制台查看数据源状态：
```javascript
console.log('Using:', dataSource.useSupabase ? 'Supabase' : 'Mock Data');
```

## 📈 扩展功能

### 实时订阅
```javascript
// 订阅技能更新
const subscription = supabase
  .from('skills')
  .on('UPDATE', payload => {
    console.log('Skill updated:', payload);
  })
  .subscribe();
```

### 文件存储
使用Supabase存储技能图标和截图。

### 边缘函数
创建自定义API端点处理复杂逻辑。

---

**需要帮助？** 查看 [Supabase文档](https://supabase.com/docs) 或创建GitHub Issue。