import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const initialCustomers = [{
  id: 1,
  name: "ABC科技有限公司",
  industry: "科技",
  status: "活跃",
  contact: "张经理",
  phone: "138-0000-1234",
  email: "zhang@abc.com",
  location: "北京市海淀区",
  revenue: "50万",
  lastContact: "2天前"
}, {
  id: 2,
  name: "XYZ制造集团",
  industry: "制造业",
  status: "潜在",
  contact: "李总监",
  phone: "139-0000-5678",
  email: "li@xyz.com",
  location: "上海市浦东新区",
  revenue: "120万",
  lastContact: "1周前"
}, {
  id: 3,
  name: "创新教育机构",
  industry: "教育",
  status: "活跃",
  contact: "王校长",
  phone: "137-0000-9999",
  email: "wang@edu.com",
  location: "深圳市南山区",
  revenue: "30万",
  lastContact: "昨天"
}];
const statusColors = {
  "活跃": "bg-success text-success-foreground",
  "潜在": "bg-warning text-warning-foreground",
  "休眠": "bg-muted text-muted-foreground"
};
const industries = ["科技", "制造业", "教育", "金融", "医疗", "零售", "服务业", "其他"];
const statuses = ["活跃", "潜在", "休眠"];
export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(initialCustomers);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    status: "",
    contact: "",
    phone: "",
    email: "",
    location: "",
    revenue: ""
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    industry: "",
    status: "",
    contact: "",
    phone: "",
    email: "",
    location: "",
    revenue: ""
  });
  const selectedCustomer = filteredCustomers.find(c => c.id === selectedCustomerId);

  // 筛选客户
  useEffect(() => {
    let filtered = customers;

    // 按搜索条件筛选
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 按状态筛选
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);
  const handleCustomerClick = (customerId: number) => {
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      setIsEditing(false);
    } else {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomerId(customerId);
        setEditFormData({
          name: customer.name,
          industry: customer.industry,
          status: customer.status,
          contact: customer.contact,
          phone: customer.phone,
          email: customer.email,
          location: customer.location,
          revenue: customer.revenue
        });
        setIsEditing(false);
      }
    }
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (selectedCustomer) {
      setEditFormData({
        name: selectedCustomer.name,
        industry: selectedCustomer.industry,
        status: selectedCustomer.status,
        contact: selectedCustomer.contact,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email,
        location: selectedCustomer.location,
        revenue: selectedCustomer.revenue
      });
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (selectedCustomerId && editFormData.name && editFormData.contact) {
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomerId 
          ? { ...customer, ...editFormData }
          : customer
      ));
      setIsEditing(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = () => {
    if (!formData.name || !formData.contact) {
      return;
    }
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      lastContact: "刚刚"
    };
    setCustomers(prev => [...prev, newCustomer]);
    setFormData({
      name: "",
      industry: "",
      status: "",
      contact: "",
      phone: "",
      email: "",
      location: "",
      revenue: ""
    });
    setIsDialogOpen(false);
  };
  return <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">客户管理</h1>
          <p className="text-muted-foreground mt-1">管理您的客户信息和关系</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              新增客户
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增客户</DialogTitle>
              <DialogDescription>
                填写客户基本信息，建立新的客户档案。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">客户名称 *</Label>
                  <Input id="name" placeholder="输入客户名称" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">所属行业</Label>
                  <Select value={formData.industry} onValueChange={value => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">联系人 *</Label>
                  <Input id="contact" placeholder="输入联系人姓名" value={formData.contact} onChange={e => handleInputChange("contact", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">客户状态</Label>
                  <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话</Label>
                  <Input id="phone" placeholder="输入联系电话" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input id="email" type="email" placeholder="输入邮箱地址" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">所在地区</Label>
                  <Input id="location" placeholder="输入所在地区" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">年收入</Label>
                  <Input id="revenue" placeholder="输入年收入" value={formData.revenue} onChange={e => handleInputChange("revenue", e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-primary">
                保存客户
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索客户名称、联系人、行业、邮箱、电话或地区..." 
                  className="pl-10" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="活跃">活跃</SelectItem>
                <SelectItem value="潜在">潜在</SelectItem>
                <SelectItem value="休眠">休眠</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>客户信息</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>地区</TableHead>
                <TableHead>年收入</TableHead>
                <TableHead>最后联系</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <button className="font-medium text-left hover:text-primary transition-colors cursor-pointer" onClick={() => handleCustomerClick(customer.id)}>
                          {customer.name}
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.industry}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[customer.status as keyof typeof statusColors]}`}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.location}</TableCell>
                  <TableCell className="font-semibold text-primary">{customer.revenue}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.lastContact}</TableCell>
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
                        <DropdownMenuItem>添加联系人</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">删除客户</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Detail Form - Expandable */}
      {selectedCustomer && <Card className="shadow-card animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">客户详情</h3>
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
                    <Button size="sm" onClick={handleStartEdit} className="bg-gradient-primary">
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomerId(null)} className="text-muted-foreground hover:text-foreground">
                      收起
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">客户名称</Label>
                  {isEditing ? (
                    <Input 
                      value={editFormData.name} 
                      onChange={e => handleEditInputChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{selectedCustomer.name}</div>
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
                        {industries.map(industry => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="font-medium">{selectedCustomer.industry}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">客户状态</Label>
                  {isEditing ? (
                    <Select value={editFormData.status} onValueChange={value => handleEditInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <Badge className={`${statusColors[selectedCustomer.status as keyof typeof statusColors]}`}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">联系人</Label>
                  {isEditing ? (
                    <Input 
                      value={editFormData.contact} 
                      onChange={e => handleEditInputChange("contact", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{selectedCustomer.contact}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">电话</Label>
                  {isEditing ? (
                    <Input 
                      value={editFormData.phone} 
                      onChange={e => handleEditInputChange("phone", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{selectedCustomer.phone}</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">邮箱</Label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={editFormData.email} 
                      onChange={e => handleEditInputChange("email", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{selectedCustomer.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">地区</Label>
                  {isEditing ? (
                    <Input 
                      value={editFormData.location} 
                      onChange={e => handleEditInputChange("location", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{selectedCustomer.location}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">年收入</Label>
                  {isEditing ? (
                    <Input 
                      value={editFormData.revenue} 
                      onChange={e => handleEditInputChange("revenue", e.target.value)}
                    />
                  ) : (
                    <div className="font-semibold text-primary">{selectedCustomer.revenue}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">最后联系</Label>
                  <div className="font-medium">{selectedCustomer.lastContact}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}
    </div>;
}