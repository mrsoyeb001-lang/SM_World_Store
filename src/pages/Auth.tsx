import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '' 
  });
  
  const { signIn, signUp, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "লগইন ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "সফল",
        description: "সফলভাবে লগইন হয়েছে"
      });
      
      // Wait for profile to load and redirect accordingly
      setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/dashboard');
      }, 1500);
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "ত্রুটি",
        description: "পাসওয়ার্ড মিল নেই",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
    
    if (error) {
      toast({
        title: "রেজিস্ট্রেশন ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "সফল",
        description: "সফলভাবে রেজিস্ট্রেশন হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">Badhon's World</CardTitle>
          <CardDescription>
            আপনার অ্যাকাউন্টে প্রবেশ করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">লগইন</TabsTrigger>
              <TabsTrigger value="signup">রেজিস্ট্রেশন</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                  {loading ? 'অপেক্ষা করুন...' : 'লগইন'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">পূর্ণ নাম</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">ইমেইল</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="আপনার ইমেইল"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                  {loading ? 'অপেক্ষা করুন...' : 'রেজিস্ট্রেশন'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}