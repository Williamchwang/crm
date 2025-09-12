#  Project info

## 技术架构
- **技术栈**: Vite + React + TypeScript
- **UI组件库**: shadcn/ui - 基于Radix UI的现代组件库
- **样式**：Tailwind CSS

## 项目目录结构
crm/
├── public/                     # 静态资源目录
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/                        # 源代码目录
│   ├── components/             # 组件目录
│   │   ├── ui/                # shadcn/ui组件库，包含40个UI组件
│   │   ├── AppSidebar.tsx     # 侧边栏导航组件
│   │   └── Layout.tsx         # 页面布局组件，包含头部和侧边栏
│   ├── pages/                 # 各页面组件目录
│   │   ├── Dashboard.tsx      # 仪表板页面
│   │   ├── Customers.tsx      # 客户管理页面
│   │   ├── Leads.tsx          # 线索管理页面
│   │   ├── Contacts.tsx       # 联系人管理页面
│   │   ├── Index.tsx          # 首页
│   │   └── NotFound.tsx       # 404页面
│   ├── hooks/                 # 自定义React Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                   # 工具函数库
│   │   └── utils.ts          # 工具函数，包含样式合并等通用方法
│   ├── App.tsx               # 应用主组件，配置路由和全局状态
│   ├── main.tsx              # 应用入口，React应用挂载点
│   ├── index.css             # 全局样式文件
│   └── vite-env.d.ts         # Vite环境类型声明
├── package.json               # 项目依赖配置
├── vite.config.ts            # Vite构建配置
├── tailwind.config.ts        # Tailwind CSS配置
├── tsconfig.json             # TypeScript配置
├── eslint.config.js          # ESLint代码规范配置
├── components.json           # shadcn/ui组件配置
├── postcss.config.js         # PostCSS配置
└── index.html                # HTML入口文件