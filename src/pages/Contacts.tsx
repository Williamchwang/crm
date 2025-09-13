import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Plus, 
  Search, 
  Filter,
  Phone,
  Mail,
  Building,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: number;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  status: string;
  lastContact: string;
  nextTask: string;
  notes?: string;
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "张经理",
    title: "销售总监", 
    company: "ABC科技有限公司",
    phone: "138-0000-1234",
    email: "zhang@abc.com",
    status: "活跃",
    lastContact: "2天前",
    nextTask: "产品演示"
  },
  {
    id: 2,
    name: "李总监",
    title: "采购经理",
    company: "XYZ制造集团", 
    phone: "139-0000-5678",
    email: "li@xyz.com",
    status: "跟进中",
    lastContact: "1周前",
    nextTask: "方案讨论"
  },
  {
    id: 3,
    name: "王校长",
    title: "校长",
    company: "创新教育机构",
    phone: "137-0000-9999", 
    email: "wang@edu.com",
    status: "活跃",
    lastContact: "昨天",
    nextTask: "合同签署"
  },
  {
    id: 4,
    name: "陈助理",
    title: "行政助理",
    company: "ABC科技有限公司",
    phone: "136-0000-1111",
    email: "chen@abc.com", 
    status: "潜在",
    lastContact: "3天前",
    nextTask: "初次会面"
  }
];

const statusColors = {
  "活跃": "bg-success text-success-foreground",
  "跟进中": "bg-info text-info-foreground", 
  "潜在": "bg-warning text-warning-foreground",
  "暂停": "bg-muted text-muted-foreground"
};

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    status: "潜在",
    lastContact: "今天",
    nextTask: "",
    notes: ""
  });

  const handleInputChange = (field: keyof Contact, value: string) => {
    setNewContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.company || !newContact.email) {
      alert("请填写必填字段：姓名、公司和邮箱");
      return;
    }

    const contact: Contact = {
      id: Math.max(...contacts.map(c => c.id)) + 1,
      name: newContact.name,
      title: newContact.title || "",
      company: newContact.company,
      phone: newContact.phone || "",
      email: newContact.email,
      status: newContact.status || "潜在",
      lastContact: newContact.lastContact || "今天",
      nextTask: newContact.nextTask || "",
      notes: newContact.notes || ""
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({
      name: "",
      title: "",
      company: "",
      phone: "",
      email: "",
      status: "潜在",
      lastContact: "今天",
      nextTask: "",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">联系人管理</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              新增联系人
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增联系人</DialogTitle>
              <DialogDescription>
                填写联系人的基本信息，带*的字段为必填项
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    placeholder="请输入姓名"
                    value={newContact.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">职位</Label>
                  <Input
                    id="title"
                    placeholder="请输入职位"
                    value={newContact.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">公司 *</Label>
                <Input
                  id="company"
                  placeholder="请输入公司名称"
                  value={newContact.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    placeholder="请输入电话号码"
                    value={newContact.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={newContact.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select
                    value={newContact.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="活跃">活跃</SelectItem>
                      <SelectItem value="跟进中">跟进中</SelectItem>
                      <SelectItem value="潜在">潜在</SelectItem>
                      <SelectItem value="暂停">暂停</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextTask">下次任务</Label>
                  <Input
                    id="nextTask"
                    placeholder="请输入下次任务"
                    value={newContact.nextTask}
                    onChange={(e) => handleInputChange("nextTask", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  placeholder="请输入备注信息"
                  value={newContact.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddContact} className="bg-gradient-primary">
                添加联系人
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索联系人姓名、公司或职位..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">{contact.name}</CardTitle>
                    <CardDescription className="truncate">{contact.title}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>查看详情</DropdownMenuItem>
                    <DropdownMenuItem>编辑信息</DropdownMenuItem>
                    <DropdownMenuItem>发送邮件</DropdownMenuItem>
                    <DropdownMenuItem>添加任务</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">删除联系人</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge 
                className={`w-fit ${statusColors[contact.status as keyof typeof statusColors]}`}
              >
                {contact.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{contact.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{contact.nextTask}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">最后联系时间</p>
                <p className="text-sm font-medium">{contact.lastContact}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}