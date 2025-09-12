# CRM系统前端项目

## 技术栈
### 核心框架: React 18 + TypeScript + Vite
### UI样式: shadcn/ui 组件库，Tailwind CSS，Lucide React 图标库
### 状态管理和数据:React Query (TanStack Query) 数据获取和缓存，React Router DOM 客户端路由管理，React Hook Form 表单处理
### 环境要求: Node.js 18.0+

## 业务功能
### 仪表板: 实时显示客户、联系人、线索、工单等关键业务指标
### 客户管理: 完整的客户档案，包括公司信息、行业分类、联系方式等，支持多维度搜索和状态筛选，支持在线编辑
### 联系人管理: 详细的联系人信息，包括职位、公司、联系方式等，支持批量添加、编辑、删除联系人
### 线索管理: 从线索创建到转化的完整生命周期管理，高、中、低优先级分类，支持颜色标识，可展开的详情表单，支持在线编辑
### 工单管理: 支持多种工单类型、状态、优先级，支持按标题、描述等多维度搜索，工单统计可视化展示，大模型推荐解决方案建议

## 项目结构

**/** - 根目录
- package.json - 项目依赖配置
- vite.config.ts - Vite构建配置
- tailwind.config.ts - Tailwind CSS配置
- tsconfig.json - TypeScript配置
- tsconfig.app.json - 应用TypeScript配置
- tsconfig.node.json - Node.js TypeScript配置
- eslint.config.js - ESLint代码规范配置
- components.json - shadcn/ui组件配置
- postcss.config.js - PostCSS配置
- index.html - HTML入口文件

**public/** - 静态资源目录
- favicon.ico - 网站图标
- placeholder.svg - 占位图片
- robots.txt - 搜索引擎配置

**src/** - 源代码目录
- App.tsx - 应用主组件，配置路由和全局状态
- main.tsx - 应用入口文件，React应用挂载点
- index.css - 全局样式文件
- vite-env.d.ts - Vite环境类型声明

**src/components/** - 组件目录
- AppSidebar.tsx - 侧边栏导航组件
- Layout.tsx - 页面布局组件，包含头部和侧边栏

**src/components/ui/** - shadcn/ui 标准组件库 (40+ 组件)

**src/pages/** - 各页面组件目录
- Dashboard.tsx - 仪表板页面
- Customers.tsx - 客户管理页面
- Contacts.tsx - 联系人管理页面
- Leads.tsx - 线索管理页面
- Tickets.tsx - 工单管理页面
- Index.tsx - 首页组件
- NotFound.tsx - 404页面

**src/hooks/** - 自定义React Hooks
- use-mobile.tsx - 移动端检测Hook
- use-toast.ts - 消息提示Hook

**src/lib/** - 工具函数库
- utils.ts - 通用工具函数

## 现代化UI设计
### 响应式布局: 完美适配桌面端、平板和移动设备
### 暗色模式支持: 内置主题切换功能
### 渐变色彩: 精心设计的渐变色彩方案
### 微交互: 流畅的动画和过渡效果
### 卡片式设计: 清晰的信息层次和视觉分组

## 用户体验
### 直观导航: 侧边栏导航，支持折叠展开
### 快速搜索: 全局搜索功能，支持多模块搜索
### 批量操作: 支持批量编辑、删除等操作
### 实时反馈: 操作结果即时反馈和状态更新
### 键盘快捷键: 支持常用操作的键盘快捷键