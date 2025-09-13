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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { getTickets, saveTicketId, getSavedTicketIds, Ticket as TicketData, getTypeDisplayText, getStatusDisplayText, createTicket, updateTicket, deleteTicket } from "@/services/tickets";
import { isLoggedIn } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

// 工单状态枚举
type TicketStatus = "1" | "3" | "5" | "待分配" | "处理中" | "已完成";
type TicketType = "1" | "3" | "5" | "咨询" | "维修" | "投诉";

// 状态配置
const statusConfig = {
  "1": { label: "待分配", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "3": { label: "处理中", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  "5": { label: "已完成", color: "bg-green-100 text-green-800", icon: CheckCircle },
  // 支持中文状态值
  "待分配": { label: "待分配", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "处理中": { label: "处理中", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  "已完成": { label: "已完成", color: "bg-green-100 text-green-800", icon: CheckCircle }
};

const typeConfig = {
  "1": "咨询",
  "3": "维修",
  "5": "投诉",
  // 支持中文类型值
  "咨询": "咨询",
  "维修": "维修",
  "投诉": "投诉"
};

// 安全获取状态配置
const getStatusConfig = (status: string) => {
  const displayStatus = getStatusDisplayText(status);
  return statusConfig[displayStatus as keyof typeof statusConfig] || {
    label: displayStatus,
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle
  };
};

// 安全获取类型配置
const getTypeConfig = (type: string) => {
  return getTypeDisplayText(type);
};


export default function Tickets() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [solutionText, setSolutionText] = useState("");
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<TicketData | null>(null);
  const { toast } = useToast();
  const [editFormData, setEditFormData] = useState({
    title: "",
    type: "1",
    status: "1",
    description: "",
    contact: "",
    phone: "",
    remarks: ""
  });
  const [newTicket, setNewTicket] = useState<Partial<TicketData>>({
    title: "",
    type: "1",
    status: "1",
    description: "",
    contact: "",
    phone: "",
    remarks: ""
  });
  const solutionScrollRef = useRef<HTMLDivElement>(null);

  // 加载工单数据
  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const ticketData = await getTickets();
      setTickets(ticketData);
      setFilteredTickets(ticketData);
      
      // 保存工单ID
      ticketData.forEach(ticket => {
        saveTicketId(ticket.id);
      });
    } catch (error) {
      console.error('加载工单数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // 组件挂载时加载数据
  useEffect(() => {
    loadTickets();
  }, []);

  // 移除页面可见性变化的自动刷新，避免过于频繁的请求

  // 处理输入变化
  const handleInputChange = (field: keyof TicketData, value: string) => {
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
  const handleAddTicket = async () => {
    if (!newTicket.title) {
      toast({
        title: "验证失败",
        description: "请填写必填字段：标题",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingTicket(true);

    const ticket: TicketData = {
      id: generateTicketId(),
      title: newTicket.title,
      type: newTicket.type as TicketType || "1",
      status: newTicket.status as TicketStatus || "1",
      description: newTicket.description || "",
      contact: newTicket.contact || "",
      phone: newTicket.phone || "",
      remarks: newTicket.remarks || ""
    };

    try {
      // 调用创建工单API
      const createdTicket = await createTicket(ticket);
      
      // 更新本地工单列表，将新工单添加到第一行
      setTickets(prev => [createdTicket, ...prev]);
      
      // 清空表单
      setNewTicket({
        title: "",
        type: "1",
        status: "1",
        description: "",
        contact: "",
        phone: "",
        remarks: ""
      });
      
      // 关闭对话框
      setIsDialogOpen(false);
      
      // 显示成功消息
      toast({
        title: "创建成功",
        description: "工单创建成功！",
      });
    } catch (error) {
      console.error('创建工单失败:', error);
      toast({
        title: "创建失败",
        description: `创建工单失败: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  // 处理工单选择
  const handleTicketSelect = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    // 自动触发生成解决方案
    generateSolutionForTicket(ticket);
  };

  // 编辑相关函数
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartEdit = () => {
    if (selectedTicket) {
      setEditFormData({
        title: selectedTicket.title,
        type: selectedTicket.type,
        status: selectedTicket.status,
        description: selectedTicket.description,
        contact: selectedTicket.contact,
        phone: selectedTicket.phone,
        remarks: selectedTicket.remarks
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedTicket || !editFormData.title) {
      toast({
        title: "验证失败",
        description: "请填写必填字段：标题",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingTicket(true);

    try {
      const updatedTicket = {
        ...selectedTicket,
        ...editFormData,
        type: editFormData.type as TicketType,
        status: editFormData.status as TicketStatus
      };

      // 调用更新工单API
      const savedTicket = await updateTicket(updatedTicket);
      
      // 更新本地工单列表
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? savedTicket
          : ticket
      ));
      setSelectedTicket(savedTicket);
      setIsEditing(false);
      
      // 显示成功消息
      toast({
        title: "更新成功",
        description: "工单更新成功！",
      });
    } catch (error) {
      console.error('更新工单失败:', error);
      toast({
        title: "更新失败",
        description: `更新工单失败: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingTicket(false);
    }
  };

  // 确认删除工单
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    
    setIsDeleteDialogOpen(false);
    await handleDeleteTicket(ticketToDelete);
    setTicketToDelete(null);
  };

  // 取消删除工单
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  // 删除工单
  const handleDeleteTicket = async (ticket: TicketData) => {
    setIsDeletingTicket(true);
    
    try {
      // 调用删除工单API
      await deleteTicket(ticket.id);
      
      // 从本地工单列表中移除
      setTickets(prev => prev.filter(t => t.id !== ticket.id));
      
      // 如果删除的是当前选中的工单，清空选中状态
      if (selectedTicket?.id === ticket.id) {
        setSelectedTicket(null);
      }
      
      // 显示成功消息
      toast({
        title: "删除成功",
        description: "工单删除成功！",
      });
    } catch (error) {
      console.error('删除工单失败:', error);
      toast({
        title: "删除失败",
        description: `删除工单失败: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive",
      });
    } finally {
      setIsDeletingTicket(false);
    }
  };

  // 处理菜单操作
  const handleMenuAction = (action: string, ticket: TicketData) => {
    switch (action) {
      case "view":
        handleTicketSelect(ticket);
        break;
      case "edit":
        // 这里可以实现编辑功能
        toast({
          title: "编辑工单",
          description: `正在编辑工单: ${ticket.title}`,
        });
        break;
      case "delete":
        setTicketToDelete(ticket);
        setIsDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };


  // 筛选工单
  useEffect(() => {
    let filtered = tickets;

    // 按搜索条件筛选
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phone.toLowerCase().includes(searchQuery.toLowerCase())
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
  const generateSolutionForTicket = async (ticket: TicketData) => {
    setIsGeneratingSolution(true);
    setSolutionText("");

    // 模拟大模型流式输出
    const prompt = `${ticket.description}\n请根据以上内容，推荐工单解决方案建议，简明扼要，突出重点。\n请使用Markdown格式输出:`;
    
    // 模拟流式响应
    const statusConfigItem = getStatusConfig(ticket.status);
    const typeValue = getTypeDisplayText(ticket.type);
    const statusValue = getStatusDisplayText(ticket.status);
    const mockSolution = `## 解决方案建议

### 问题分析
根据工单描述，这是一个${typeValue}问题，状态为${statusValue}。

### 联系信息
- 联系人：${ticket.contact}
- 联系电话：${ticket.phone}
- 备注：${ticket.remarks}

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

    // 短暂显示加载动画（1秒）
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGeneratingSolution(false);

    // 模拟逐字输出效果
    for (let i = 0; i < mockSolution.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setSolutionText(prev => prev + mockSolution[i]);
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">工单管理</h1>
        </div>
        <div className="flex items-center gap-2">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">类型</Label>
                  <Select
                    value={newTicket.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="1">咨询</SelectItem>
                       <SelectItem value="3">维修</SelectItem>
                       <SelectItem value="5">投诉</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select
                    value={newTicket.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="1">待分配</SelectItem>
                       <SelectItem value="3">处理中</SelectItem>
                       <SelectItem value="5">已完成</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">问题描述</Label>
                <Textarea
                  id="description"
                  placeholder="请详细描述问题或需求（可选）"
                  value={newTicket.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={1}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">联系人</Label>
                  <Input
                    id="contact"
                    placeholder="请输入联系人姓名"
                    value={newTicket.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    placeholder="请输入联系电话"
                    value={newTicket.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">备注</Label>
                <Textarea
                  id="remarks"
                  placeholder="请输入备注信息"
                  value={newTicket.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  rows={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreatingTicket}
              >
                取消
              </Button>
              <Button 
                onClick={handleAddTicket} 
                className="bg-gradient-primary"
                disabled={isCreatingTicket}
              >
                {isCreatingTicket ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    创建中...
                  </>
                ) : (
                  "创建工单"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>


      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索工单标题、描述、联系人或电话..."
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
                <SelectItem value="1">待分配</SelectItem>
                <SelectItem value="3">处理中</SelectItem>
                <SelectItem value="5">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 工单列表 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>工单列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">正在加载工单数据...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">标题</TableHead>
                  <TableHead className="w-20">类型</TableHead>
                  <TableHead className="w-24">状态</TableHead>
                  <TableHead className="w-48">问题描述</TableHead>
                  <TableHead className="w-24">联系人</TableHead>
                  <TableHead className="w-32">电话</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => {
                  const statusConfigItem = getStatusConfig(ticket.status);
                  const StatusIcon = statusConfigItem.icon;
                  return (
                    <TableRow 
                      key={ticket.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <TableCell className="w-32">
                        <div className="truncate" title={ticket.title}>
                          {ticket.title.length > 10 ? `${ticket.title.substring(0, 10)}...` : ticket.title}
                        </div>
                      </TableCell>
                      <TableCell className="w-20">{getTypeConfig(ticket.type)}</TableCell>
                      <TableCell className="w-24">
                        <Badge className={statusConfigItem.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfigItem.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-48">
                        <div className="truncate" title={ticket.description}>
                          {ticket.description.length > 15 ? `${ticket.description.substring(0, 15)}...` : ticket.description}
                        </div>
                      </TableCell>
                      <TableCell className="w-24">{ticket.contact}</TableCell>
                      <TableCell className="w-32">{ticket.phone}</TableCell>
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
                            <DropdownMenuItem 
                              onClick={() => handleMenuAction("delete", ticket)}
                              className="text-destructive"
                              disabled={isDeletingTicket}
                            >
                              {isDeletingTicket ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  删除中...
                                </>
                              ) : (
                                "删除工单"
                              )}
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
          )}
        </CardContent>
      </Card>

      {/* 工单详情和推荐解决方案 */}
      {selectedTicket && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 工单详情 */}
          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    工单详情
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        取消
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveEdit} 
                        className="bg-gradient-primary"
                        disabled={isUpdatingTicket}
                      >
                        {isUpdatingTicket ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            保存中...
                          </>
                        ) : (
                          "保存"
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={handleStartEdit} className="bg-gradient-primary">
                      编辑
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <Label className="text-xs text-muted-foreground">标题</Label>
                 {isEditing ? (
                   <Input 
                     value={editFormData.title} 
                     onChange={e => handleEditInputChange("title", e.target.value)}
                   />
                 ) : (
                   <div className="font-medium">{selectedTicket.title}</div>
                 )}
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-xs text-muted-foreground">类型</Label>
                   {isEditing ? (
                     <Select value={editFormData.type} onValueChange={value => handleEditInputChange("type", value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="选择类型" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="1">咨询</SelectItem>
                         <SelectItem value="3">维修</SelectItem>
                         <SelectItem value="5">投诉</SelectItem>
                       </SelectContent>
                     </Select>
                   ) : (
                     <div className="font-medium">{getTypeConfig(selectedTicket.type)}</div>
                   )}
                 </div>
                 <div>
                   <Label className="text-xs text-muted-foreground">状态</Label>
                   {isEditing ? (
                     <Select value={editFormData.status} onValueChange={value => handleEditInputChange("status", value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="选择状态" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="1">待分配</SelectItem>
                         <SelectItem value="3">处理中</SelectItem>
                         <SelectItem value="5">已完成</SelectItem>
                       </SelectContent>
                     </Select>
                   ) : (
                     <div className="mt-1">
                       {(() => {
                         const statusConfigItem = getStatusConfig(selectedTicket.status);
                         const StatusIcon = statusConfigItem.icon;
                         return (
                           <Badge className={statusConfigItem.color}>
                             <StatusIcon className="w-3 h-3 mr-1" />
                             {statusConfigItem.label}
                           </Badge>
                         );
                       })()}
                     </div>
                   )}
                 </div>
               </div>
               
               <div>
                 <Label className="text-xs text-muted-foreground">问题描述</Label>
                 {isEditing ? (
                   <Textarea 
                     value={editFormData.description} 
                     onChange={e => handleEditInputChange("description", e.target.value)}
                     rows={1}
                   />
                 ) : (
                   <div className="font-medium">{selectedTicket.description}</div>
                 )}
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-xs text-muted-foreground">联系人</Label>
                   {isEditing ? (
                     <Input 
                       value={editFormData.contact} 
                       onChange={e => handleEditInputChange("contact", e.target.value)}
                     />
                   ) : (
                     <div className="font-medium">{selectedTicket.contact}</div>
                   )}
                 </div>
                 <div>
                   <Label className="text-xs text-muted-foreground">电话</Label>
                   {isEditing ? (
                     <Input 
                       value={editFormData.phone} 
                       onChange={e => handleEditInputChange("phone", e.target.value)}
                     />
                   ) : (
                     <div className="font-medium">{selectedTicket.phone}</div>
                   )}
                 </div>
               </div>
               
               <div>
                 <Label className="text-xs text-muted-foreground">备注</Label>
                 {isEditing ? (
                   <Textarea 
                     value={editFormData.remarks} 
                     onChange={e => handleEditInputChange("remarks", e.target.value)}
                     rows={1}
                   />
                 ) : (
                   <div className="font-medium">{selectedTicket.remarks}</div>
                 )}
               </div>
             </CardContent>
          </Card>

          {/* 推荐解决方案 */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                推荐解决方案
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {isGeneratingSolution ? (
                 <div className="flex items-center justify-center h-80 border border-gray-300 rounded-md bg-gray-25">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                     <p className="text-sm text-muted-foreground">正在生成解决方案...</p>
                   </div>
                 </div>
               ) : solutionText ? (
                 <div className="h-80 border border-gray-300 rounded-md bg-gray-25">
                   <ScrollArea ref={solutionScrollRef} className="h-80 w-full p-4">
                     <div className="text-sm max-w-none">
                       <div className="whitespace-pre-wrap">{solutionText}</div>
                     </div>
                   </ScrollArea>
                 </div>
               ) : (
                 <div className="flex items-center justify-center h-80 border border-gray-300 rounded-md bg-gray-25">
                   <p className="text-sm text-muted-foreground">点击工单查看解决方案</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除工单</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除工单 <strong>"{ticketToDelete?.title}"</strong> 吗？
              <br />
              此操作无法撤销，工单将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeletingTicket}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeletingTicket}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingTicket ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
