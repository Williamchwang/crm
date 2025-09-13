import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User, Lock, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { login, saveToken, saveUsername, getToken, getUsername, clearToken, isLoggedIn as checkLoginStatus } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

export function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => checkLoginStatus());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getUsername() || "");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const { toast } = useToast();

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData);
      saveToken(response.access_token);
      saveUsername(formData.username);
      setCurrentUser(formData.username);
      setIsLoggedIn(true);
      setIsDialogOpen(false);
      setFormData({ username: "", password: "" });
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });
    } catch (error) {
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "登录时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理登出
  const handleLogout = () => {
    clearToken();
    setCurrentUser("");
    setIsLoggedIn(false);
    toast({
      title: "已登出",
      description: "您已成功登出",
    });
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索客户、联系人或商机..." 
                  className="pl-10 w-80"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser ? currentUser.charAt(0).toUpperCase() : "用户"}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    登出
                  </Button>
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">用户</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        用户登录
                      </DialogTitle>
                      <DialogDescription>
                        请输入您的用户名和密码以登录系统
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleLogin} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="请输入用户名"
                          className="w-full"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="请输入密码"
                            className="pl-10 w-full"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-muted-foreground">记住我</span>
                        </label>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          忘记密码？
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isLoading}
                        >
                          {isLoading ? "登录中..." : "登录"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          取消
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}