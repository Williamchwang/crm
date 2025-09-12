import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Ticket,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  Info,
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";

// 工单状态枚举
type TicketStatus = "pending" | "processing" | "resolved" | "closed";
type Priority = "low" | "medium" | "high" | "urgent";
type Category = "technical" | "feature" | "bug" | "account" | "billing" | "other";

// 工单接口
interface Ticket {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: TicketStatus;
  priority: Priority;
  assignedTo: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

// 状态配置
const statusConfig = {
  pending: { label: "待处理", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "处理中", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  resolved: { label: "已解决", color: "bg-green-100 text-green-800", icon: CheckCircle },
  closed: { label: "已关闭", color: "bg-gray-100 text-gray-800", icon: XCircle }
};

const priorityConfig = {
  low: { label: "低", color: "bg-gray-100 text-gray-800" },
  medium: { label: "中", color: "bg-blue-100 text-blue-800" },
  high: { label: "高", color: "bg-orange-100 text-orange-800" },
  urgent: { label: "紧急", color: "bg-red-100 text-red-800" }
};

const categoryConfig = {
  technical: "技术支持",
  feature: "功能请求", 
  bug: "Bug报告",
  account: "账户问题",
  billing: "计费问题",
  other: "其他"
};

// 模拟数据
const initialTickets: Ticket[] = [
  {
    id: "T001",
    title: "系统登录异常",
    description: "用户反馈无法正常登录系统，提示密码错误，但密码确认无误",
    category: "technical",
    status: "pending",
    priority: "high",
    assignedTo: "张三",
    assignee: "李四",
    createdAt: "2024-01-15 09:30:00",
    updatedAt: "2024-01-15 09:30:00"
  },
  {
    id: "T002", 
    title: "新增客户导出功能",
    description: "希望能够在客户管理页面添加批量导出客户信息的功能",
    category: "feature",
    status: "processing",
    priority: "medium",
    assignedTo: "王五",
    assignee: "赵六",
    createdAt: "2024-01-14 14:20:00",
    updatedAt: "2024-01-15 10:15:00"
  },
  {
    id: "T003",
    title: "数据统计页面显示错误",
    description: "仪表板的数据统计卡片显示的数据与实际不符",
    category: "bug",
    status: "resolved",
    priority: "high",
    assignedTo: "钱七",
    assignee: "孙八",
    createdAt: "2024-01-13 16:45:00",
    updatedAt: "2024-01-14 11:30:00"
  },
  {
    id: "T004",
    title: "账户权限问题",
    description: "新注册用户无法访问某些功能模块",
    category: "account",
    status: "closed",
    priority: "urgent",
    assignedTo: "周九",
    assignee: "吴十",
    createdAt: "2024-01-12 08:15:00",
    updatedAt: "2024-01-13 17:20:00"
  }
];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [solutionText, setSolutionText] = useState("");
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    title: "",
    description: "",
    category: "technical",
    priority: "medium",
    assignedTo: "",
    assignee: ""
  });
  const solutionScrollRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleInputChange = (field: keyof Ticket, value: string) => {
    setNewTicket(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 生成新的工单ID
  const generateTicketId = () => {
    const maxId = Math.max(...tickets.map(t => parseInt(t.id.substring(1))));
    return `T${String(maxId + 1).padStart(3, '0')}`;
  };

  // 添加新工单
  const handleAddTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      alert("请填写必填字段：标题和描述");
      return;
    }

    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-');

    const ticket: Ticket = {
      id: generateTicketId(),
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category as Category || "technical",
      status: "pending",
      priority: newTicket.priority as Priority || "medium",
      assignedTo: newTicket.assignedTo || "待分配",
      assignee: newTicket.assignee || "待分配",
      createdAt: now,
      updatedAt: now
    };

    setTickets(prev => [...prev, ticket]);
    setNewTicket({
      title: "",
      description: "",
      category: "technical",
      priority: "medium",
      assignedTo: "",
      assignee: ""
    });
    setIsDialogOpen(false);
  };

  // 处理菜单操作
  const handleMenuAction = (action: string, ticket: Ticket) => {
    switch (action) {
      case "view":
        setSelectedTicket(ticket);
        break;
      case "edit":
        // 这里可以实现编辑功能
        alert(`编辑工单: ${ticket.title}`);
        break;
      case "assign":
        // 这里可以实现分配功能
        alert(`分配工单: ${ticket.title}`);
        break;
      case "close":
        // 关闭工单
        setTickets(prev => prev.map(t => 
          t.id === ticket.id 
            ? { ...t, status: "closed" as TicketStatus, updatedAt: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }).replace(/\//g, '-') }
            : t
        ));
        break;
      case "delete":
        if (confirm(`确定要删除工单 "${ticket.title}" 吗？`)) {
          setTickets(prev => prev.filter(t => t.id !== ticket.id));
        }
        break;
      default:
        break;
    }
  };

  // 统计各状态工单数量
  const getStatusCounts = () => {
    const counts = {
      total: tickets.length,
      pending: tickets.filter(t => t.status === "pending").length,
      processing: tickets.filter(t => t.status === "processing").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
      closed: tickets.filter(t => t.status === "closed").length
    };
    return counts;
  };

  // 筛选工单
  useEffect(() => {
    let filtered = tickets;

    // 按搜索条件筛选
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 按状态筛选
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
    
    // 设置第一个工单为选中状态
    if (filtered.length > 0) {
      setSelectedTicket(filtered[0]);
    } else {
      setSelectedTicket(null);
    }
  }, [tickets, searchQuery, statusFilter]);

  // 自动滚动到解决方案底部
  useEffect(() => {
    if (solutionText && solutionScrollRef.current) {
      const scrollContainer = solutionScrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [solutionText]);

  // 生成解决方案
  const generateSolution = async () => {
    if (!selectedTicket) return;
    
    setIsGeneratingSolution(true);
    setSolutionText("");

    // 模拟大模型流式输出
    const prompt = `${selectedTicket.description}\n请根据以上内容，推荐工单解决方案建议，简明扼要，突出重点。\n请使用Markdown格式输出:`;
    
    // 模拟流式响应
    const mockSolution = `## 解决方案建议

### 问题分析
根据工单描述，这是一个${categoryConfig[selectedTicket.category]}问题，优先级为${priorityConfig[selectedTicket.priority].label}。

### 解决步骤

1. **问题确认**
   - 联系用户确认具体错误信息
   - 检查用户账户状态和权限设置
   - 验证登录凭据的有效性

2. **技术排查**
   - 检查系统日志中的相关错误记录
   - 验证数据库连接和用户表状态
   - 测试不同浏览器的兼容性

3. **解决方案**
   - 重置用户密码（如需要）
   - 更新用户权限配置
   - 清除浏览器缓存和Cookie

### 预防措施
- 定期检查系统日志
- 建立用户权限审核机制
- 提供用户自助重置密码功能

### 后续跟进
- 确认问题解决后关闭工单
- 记录解决方案到知识库
- 定期回访用户满意度`;

    // 模拟逐字输出效果
    for (let i = 0; i < mockSolution.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setSolutionText(prev => prev + mockSolution[i]);
    }
    
    setIsGeneratingSolution(false);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">工单管理</h1>
          <p className="text-muted-foreground mt-1">管理和跟踪客户服务工单</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              新建工单
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新建工单</DialogTitle>
              <DialogDescription>
                填写工单的基本信息，带*的字段为必填项
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  placeholder="请输入工单标题"
                  value={newTicket.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">描述 *</Label>
                <Textarea
                  id="description"
                  placeholder="请详细描述问题或需求"
                  value={newTicket.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">技术支持</SelectItem>
                      <SelectItem value="feature">功能请求</SelectItem>
                      <SelectItem value="bug">Bug报告</SelectItem>
                      <SelectItem value="account">账户问题</SelectItem>
                      <SelectItem value="billing">计费问题</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">分配给</Label>
                  <Input
                    id="assignedTo"
                    placeholder="请输入分配对象"
                    value={newTicket.assignedTo}
                    onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">负责人</Label>
                  <Input
                    id="assignee"
                    placeholder="请输入负责人"
                    value={newTicket.assignee}
                    onChange={(e) => handleInputChange("assignee", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddTicket} className="bg-gradient-primary">
                创建工单
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总工单数</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">处理中</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.processing}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已解决</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已关闭</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* 查询条件 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>查询条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="搜索工单标题、描述或处理人员..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="resolved">已解决</SelectItem>
                <SelectItem value="closed">已关闭</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 工单列表 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>工单列表</CardTitle>
          <CardDescription>共 {filteredTickets.length} 个工单</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工单ID</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon;
                  return (
                    <TableRow 
                      key={ticket.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                      <TableCell>{categoryConfig[ticket.category]}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[ticket.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig[ticket.priority].color}>
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMenuAction("view", ticket)}>
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("edit", ticket)}>
                              编辑工单
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("assign", ticket)}>
                              分配工单
                            </DropdownMenuItem>
                            {ticket.status !== "closed" && (
                              <DropdownMenuItem onClick={() => handleMenuAction("close", ticket)}>
                                关闭工单
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleMenuAction("delete", ticket)}
                              className="text-destructive"
                            >
                              删除工单
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 工单详情和推荐解决方案 */}
      {selectedTicket && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 工单详情 */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                工单详情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">工单ID</Label>
                  <p className="text-sm font-mono">{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">分类</Label>
                  <p className="text-sm">{categoryConfig[selectedTicket.category]}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">标题</Label>
                <p className="text-sm font-medium">{selectedTicket.title}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">描述</Label>
                <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">状态</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedTicket.status].color}>
                      {(() => {
                        const StatusIcon = statusConfig[selectedTicket.status].icon;
                        return <StatusIcon className="w-3 h-3 mr-1" />;
                      })()}
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">优先级</Label>
                  <div className="mt-1">
                    <Badge className={priorityConfig[selectedTicket.priority].color}>
                      {priorityConfig[selectedTicket.priority].label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">分配给</Label>
                  <p className="text-sm">{selectedTicket.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">负责人</Label>
                  <p className="text-sm">{selectedTicket.assignee}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">创建时间</Label>
                  <p className="text-sm">{selectedTicket.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">更新时间</Label>
                  <p className="text-sm">{selectedTicket.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 推荐解决方案 */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                推荐解决方案
              </CardTitle>
              <CardDescription>基于工单描述自动生成的解决方案建议</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateSolution}
                disabled={isGeneratingSolution}
                className="w-full"
              >
                {isGeneratingSolution ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Info className="mr-2 h-4 w-4" />
                    生成解决方案
                  </>
                )}
              </Button>
              
               {solutionText && (
                 <div className="space-y-2">
                   <Label className="text-sm font-medium">解决方案内容</Label>
                   <ScrollArea ref={solutionScrollRef} className="h-80 w-full border rounded-md p-4">
                     <div className="prose prose-sm max-w-none">
                       <div className="whitespace-pre-wrap">{solutionText}</div>
                     </div>
                   </ScrollArea>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
