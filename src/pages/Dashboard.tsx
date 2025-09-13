import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Contact, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  RefreshCw,
  Clock,
  AlertCircle
} from "lucide-react";

// 模拟数据 - 基于现有模块的实际数据结构
const mockData = {
  customers: [
    { id: 1, name: "ABC科技有限公司", industry: "科技", status: "活跃", revenue: "50万", lastContact: "2天前" },
    { id: 2, name: "XYZ制造集团", industry: "制造业", status: "潜在", revenue: "120万", lastContact: "1周前" },
    { id: 3, name: "创新教育机构", industry: "教育", status: "活跃", revenue: "30万", lastContact: "昨天" }
  ],
  contacts: [
    { id: 1, name: "张经理", company: "ABC科技有限公司", status: "活跃", lastContact: "2天前" },
    { id: 2, name: "李总监", company: "XYZ制造集团", status: "跟进中", lastContact: "1周前" },
    { id: 3, name: "王校长", company: "创新教育机构", status: "活跃", lastContact: "昨天" },
    { id: 4, name: "陈助理", company: "ABC科技有限公司", status: "潜在", lastContact: "3天前" }
  ],
  leads: [
    { id: 1, name: "张总", company: "创新科技有限公司", status: "新线索", priority: "高", estimatedValue: "50万", lastContact: "2天前" },
    { id: 2, name: "王经理", company: "制造集团", status: "跟进中", priority: "中", estimatedValue: "120万", lastContact: "1周前" },
    { id: 3, name: "刘主任", company: "教育机构", status: "已转化", priority: "低", estimatedValue: "30万", lastContact: "昨天" }
  ],
  tickets: [
    { id: "T001", title: "系统登录异常", type: "1", status: "1", description: "用户反馈无法正常登录系统，提示密码错误，但密码确认无误", contact: "张三", phone: "13800138001", remarks: "需要优先处理，影响用户正常使用" },
    { id: "T002", title: "服务器故障维修", type: "3", status: "3", description: "服务器出现故障，需要紧急维修处理", contact: "李四", phone: "13800138002", remarks: "硬件故障，需要更换配件" },
    { id: "T003", title: "服务态度投诉", type: "5", status: "5", description: "客户对客服人员的服务态度不满意，要求改进", contact: "王五", phone: "13800138003", remarks: "已处理，客服人员已道歉" },
    { id: "T004", title: "产品功能咨询", type: "1", status: "5", description: "客户咨询产品新功能的使用方法和注意事项", contact: "赵六", phone: "13800138004", remarks: "已提供详细说明文档" }
  ]
};

// 计算统计数据
const calculateStats = () => {
  const totalCustomers = mockData.customers.length;
  const activeCustomers = mockData.customers.filter(c => c.status === "活跃").length;
  const totalContacts = mockData.contacts.length;
  const activeContacts = mockData.contacts.filter(c => c.status === "活跃").length;
  const totalLeads = mockData.leads.length;
  const newLeads = mockData.leads.filter(l => l.status === "新线索").length;
  const convertedLeads = mockData.leads.filter(l => l.status === "已转化").length;
  const totalTickets = mockData.tickets.length;
  const pendingTickets = mockData.tickets.filter(t => t.status === "1").length;
  const processingTickets = mockData.tickets.filter(t => t.status === "3").length;
  const completedTickets = mockData.tickets.filter(t => t.status === "5").length;
  
  // 计算总收入和转化率
  const totalRevenue = mockData.customers.reduce((sum, c) => {
    const revenue = parseFloat(c.revenue.replace("万", ""));
    return sum + revenue;
  }, 0);
  
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const ticketResolutionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  return {
    totalCustomers,
    activeCustomers,
    totalContacts,
    activeContacts,
    totalLeads,
    newLeads,
    convertedLeads,
    totalTickets,
    pendingTickets,
    processingTickets,
    completedTickets,
    totalRevenue,
    conversionRate,
    ticketResolutionRate
  };
};

const stats = calculateStats();

const kpiCards = [
  {
    title: "总客户数",
    value: stats.totalCustomers.toString(),
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: `其中活跃客户 ${stats.activeCustomers} 个`
  },
  {
    title: "联系人总数", 
    value: stats.totalContacts.toString(),
    change: "+8%",
    trend: "up",
    icon: Contact,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: `其中活跃联系人 ${stats.activeContacts} 个`
  },
  {
    title: "销售线索",
    value: stats.totalLeads.toString(),
    change: "+23%",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: `新线索 ${stats.newLeads} 个，已转化 ${stats.convertedLeads} 个`
  },
  {
    title: "工单总数",
    value: stats.totalTickets.toString(),
    change: "+15%",
    trend: "up",
    icon: Ticket,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: `待分配 ${stats.pendingTickets} 个，处理中 ${stats.processingTickets} 个，已完成 ${stats.completedTickets} 个`
  }
];

const businessMetrics = [
  {
    title: "总收入",
    value: `${stats.totalRevenue}万`,
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    change: "+18%"
  },
  {
    title: "线索转化率",
    value: `${stats.conversionRate}%`,
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    change: "+5%"
  },
  {
    title: "工单解决率",
    value: `${stats.ticketResolutionRate}%`,
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    change: "+3%"
  }
];


export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">仪表板</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            快速添加
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground">相比上月</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 工单状态统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总工单数</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待分配</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">处理中</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processingTickets}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessMetrics.map((metric) => (
          <Card key={metric.title} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-green-600">{metric.change} 相比上月</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}