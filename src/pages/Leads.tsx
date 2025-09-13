import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, MapPin, Calendar, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// 初始线索数据
const initialLeads = [
  {
    id: 1,
    name: "张总",
    company: "创新科技有限公司",
    position: "总经理",
    phone: "138-0000-1234",
    email: "zhang@innovate.com",
    source: "网站咨询",
    status: "新线索",
    priority: "高",
    industry: "科技",
    location: "北京市海淀区",
    description: "对我们的产品很感兴趣，希望了解更多详情",
    estimatedValue: "50万",
    assignedTo: "李销售",
    createdAt: "2024-01-15",
    lastContact: "2天前"
  },
  {
    id: 2,
    name: "王经理",
    company: "制造集团",
    position: "采购总监",
    phone: "139-0000-5678",
    email: "wang@manufacturing.com",
    source: "电话营销",
    status: "跟进中",
    priority: "中",
    industry: "制造业",
    location: "上海市浦东新区",
    description: "需要采购一批设备，正在比较供应商",
    estimatedValue: "120万",
    assignedTo: "张销售",
    createdAt: "2024-01-10",
    lastContact: "1周前"
  },
  {
    id: 3,
    name: "刘主任",
    company: "教育机构",
    position: "技术主任",
    phone: "137-0000-9999",
    email: "liu@education.com",
    source: "展会",
    status: "已转化",
    priority: "低",
    industry: "教育",
    location: "深圳市南山区",
    description: "已成功转化为客户，正在实施项目",
    estimatedValue: "30万",
    assignedTo: "陈销售",
    createdAt: "2024-01-05",
    lastContact: "昨天"
  }
];

// 状态颜色配置
const statusColors = {
  "新线索": "bg-blue-100 text-blue-800",
  "跟进中": "bg-yellow-100 text-yellow-800",
  "已转化": "bg-green-100 text-green-800",
  "已丢失": "bg-red-100 text-red-800"
};

// 优先级颜色配置
const priorityColors = {
  "高": "bg-red-100 text-red-800",
  "中": "bg-yellow-100 text-yellow-800",
  "低": "bg-green-100 text-green-800"
};

// 选项数据
const sources = ["网站咨询", "电话营销", "展会", "推荐", "广告", "其他"];
const statuses = ["新线索", "跟进中", "已转化", "已丢失"];
const priorities = ["高", "中", "低"];
const industries = ["科技", "制造业", "教育", "金融", "医疗", "零售", "服务业", "其他"];
const assignedUsers = ["李销售", "张销售", "陈销售", "王销售"];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState(initialLeads);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    source: "",
    status: "",
    priority: "",
    industry: "",
    location: "",
    description: "",
    estimatedValue: "",
    assignedTo: ""
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    source: "",
    status: "",
    priority: "",
    industry: "",
    location: "",
    description: "",
    estimatedValue: "",
    assignedTo: ""
  });

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // 处理线索点击
  const handleLeadClick = (leadId: number) => {
    if (selectedLeadId === leadId) {
      setSelectedLeadId(null);
      setIsEditing(false);
    } else {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setSelectedLeadId(leadId);
        setEditFormData({
          name: lead.name,
          company: lead.company,
          position: lead.position,
          phone: lead.phone,
          email: lead.email,
          source: lead.source,
          status: lead.status,
          priority: lead.priority,
          industry: lead.industry,
          location: lead.location,
          description: lead.description,
          estimatedValue: lead.estimatedValue,
          assignedTo: lead.assignedTo
        });
        setIsEditing(false);
      }
    }
  };

  // 处理编辑输入变化
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 开始编辑
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    if (selectedLead) {
      setEditFormData({
        name: selectedLead.name,
        company: selectedLead.company,
        position: selectedLead.position,
        phone: selectedLead.phone,
        email: selectedLead.email,
        source: selectedLead.source,
        status: selectedLead.status,
        priority: selectedLead.priority,
        industry: selectedLead.industry,
        location: selectedLead.location,
        description: selectedLead.description,
        estimatedValue: selectedLead.estimatedValue,
        assignedTo: selectedLead.assignedTo
      });
    }
    setIsEditing(false);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (selectedLeadId && editFormData.name && editFormData.company) {
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLeadId 
          ? { ...lead, ...editFormData }
          : lead
      ));
      setIsEditing(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 提交新线索
  const handleSubmit = () => {
    if (!formData.name || !formData.company) {
      return;
    }
    const newLead = {
      id: leads.length + 1,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: "刚刚"
    };
    setLeads(prev => [...prev, newLead]);
    setFormData({
      name: "",
      company: "",
      position: "",
      phone: "",
      email: "",
      source: "",
      status: "",
      priority: "",
      industry: "",
      location: "",
      description: "",
      estimatedValue: "",
      assignedTo: ""
    });
    setIsDialogOpen(false);
  };

  // 过滤线索
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">线索管理</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              新增线索
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增线索</DialogTitle>
              <DialogDescription>
                填写线索基本信息，建立新的销售机会。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input 
                    id="name" 
                    placeholder="输入联系人姓名" 
                    value={formData.name} 
                    onChange={e => handleInputChange("name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">公司名称 *</Label>
                  <Input 
                    id="company" 
                    placeholder="输入公司名称" 
                    value={formData.company} 
                    onChange={e => handleInputChange("company", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">职位</Label>
                  <Input 
                    id="position" 
                    placeholder="输入职位" 
                    value={formData.position} 
                    onChange={e => handleInputChange("position", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">所属行业</Label>
                  <Select value={formData.industry} onValueChange={value => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 联系信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话</Label>
                  <Input 
                    id="phone" 
                    placeholder="输入联系电话" 
                    value={formData.phone} 
                    onChange={e => handleInputChange("phone", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="输入邮箱地址" 
                    value={formData.email} 
                    onChange={e => handleInputChange("email", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">所在地区</Label>
                  <Input 
                    id="location" 
                    placeholder="输入所在地区" 
                    value={formData.location} 
                    onChange={e => handleInputChange("location", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">线索来源</Label>
                  <Select value={formData.source} onValueChange={value => handleInputChange("source", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 状态和优先级 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">线索状态</Label>
                  <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Select value={formData.priority} onValueChange={value => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 业务信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">预估价值</Label>
                  <Input 
                    id="estimatedValue" 
                    placeholder="输入预估价值" 
                    value={formData.estimatedValue} 
                    onChange={e => handleInputChange("estimatedValue", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">分配给</Label>
                  <Select value={formData.assignedTo} onValueChange={value => handleInputChange("assignedTo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择负责人" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedUsers.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <Label htmlFor="description">线索描述</Label>
                <Textarea 
                  id="description" 
                  placeholder="输入线索描述和备注信息" 
                  value={formData.description} 
                  onChange={e => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-primary">
                保存线索
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索线索姓名、公司或行业..." 
                className="pl-10" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 线索列表 */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>线索信息</TableHead>
                <TableHead>公司</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>预估价值</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>最后联系</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {lead.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <button 
                          className="font-medium text-left hover:text-primary transition-colors cursor-pointer" 
                          onClick={() => handleLeadClick(lead.id)}
                        >
                          {lead.name}
                        </button>
                        <div className="text-sm text-muted-foreground">{lead.position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[lead.status as keyof typeof statusColors]}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${priorityColors[lead.priority as keyof typeof priorityColors]}`}>
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.industry}</TableCell>
                  <TableCell className="font-semibold text-primary">{lead.estimatedValue}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.assignedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.lastContact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>编辑信息</DropdownMenuItem>
                        <DropdownMenuItem>转为客户</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">删除线索</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 线索详情表单 - 可展开 */}
      {selectedLead && (
        <Card className="shadow-card animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">线索详情</h3>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      取消
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit} className="bg-gradient-primary">
                      保存
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleStartEdit}>
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLeadId(null)} className="text-muted-foreground hover:text-foreground">
                      收起
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">基本信息</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {(isEditing ? editFormData.name : selectedLead.name).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">姓名</Label>
                          <Input 
                            value={editFormData.name} 
                            onChange={e => handleEditInputChange("name", e.target.value)}
                            className="font-semibold text-lg"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-lg">{selectedLead.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedLead.position}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">公司名称</Label>
                    {isEditing ? (
                      <Input 
                        value={editFormData.company} 
                        onChange={e => handleEditInputChange("company", e.target.value)}
                      />
                    ) : (
                      <div className="font-medium">{selectedLead.company}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">职位</Label>
                    {isEditing ? (
                      <Input 
                        value={editFormData.position} 
                        onChange={e => handleEditInputChange("position", e.target.value)}
                      />
                    ) : (
                      <div className="font-medium">{selectedLead.position}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">所属行业</Label>
                    {isEditing ? (
                      <Select value={editFormData.industry} onValueChange={value => handleEditInputChange("industry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择行业" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-medium">{selectedLead.industry}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 联系信息 */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">联系信息</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">联系电话</Label>
                    {isEditing ? (
                      <Input 
                        value={editFormData.phone} 
                        onChange={e => handleEditInputChange("phone", e.target.value)}
                      />
                    ) : (
                      <div className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedLead.phone}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">邮箱地址</Label>
                    {isEditing ? (
                      <Input 
                        type="email"
                        value={editFormData.email} 
                        onChange={e => handleEditInputChange("email", e.target.value)}
                      />
                    ) : (
                      <div className="font-medium text-primary flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedLead.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">所在地区</Label>
                    {isEditing ? (
                      <Input 
                        value={editFormData.location} 
                        onChange={e => handleEditInputChange("location", e.target.value)}
                      />
                    ) : (
                      <div className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedLead.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 业务信息 */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">业务信息</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">线索状态</Label>
                    {isEditing ? (
                      <Select value={editFormData.status} onValueChange={value => handleEditInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={`${statusColors[selectedLead.status as keyof typeof statusColors]}`}>
                        {selectedLead.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">优先级</Label>
                    {isEditing ? (
                      <Select value={editFormData.priority} onValueChange={value => handleEditInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={`${priorityColors[selectedLead.priority as keyof typeof priorityColors]}`}>
                        {selectedLead.priority}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">线索来源</Label>
                    {isEditing ? (
                      <Select value={editFormData.source} onValueChange={value => handleEditInputChange("source", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择来源" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map(source => (
                            <SelectItem key={source} value={source}>{source}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-medium">{selectedLead.source}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">预估价值</Label>
                    {isEditing ? (
                      <Input 
                        value={editFormData.estimatedValue} 
                        onChange={e => handleEditInputChange("estimatedValue", e.target.value)}
                      />
                    ) : (
                      <div className="font-semibold text-lg text-primary">{selectedLead.estimatedValue}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">负责人</Label>
                    {isEditing ? (
                      <Select value={editFormData.assignedTo} onValueChange={value => handleEditInputChange("assignedTo", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择负责人" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignedUsers.map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedLead.assignedTo}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">创建时间</Label>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {selectedLead.createdAt}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">最后联系</Label>
                    <div className="font-medium">{selectedLead.lastContact}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 描述信息 */}
            <div className="mt-6 space-y-2">
              <Label className="text-xs text-muted-foreground">线索描述</Label>
              {isEditing ? (
                <Textarea 
                  value={editFormData.description} 
                  onChange={e => handleEditInputChange("description", e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="font-medium text-sm leading-relaxed">{selectedLead.description}</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
