import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        variant: "destructive",
      });
    } else {
      toast({
        title: "সফল",
        description: "সফলভাবে লগইন হয়েছে",
      });

      setTimeout(() => {
        navigate(isAdmin ? "/admin" : "/dashboard");
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
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.fullName
    );

    if (error) {
      toast({
        title: "রেজিস্ট্রেশন ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "সফল",
        description: "সফলভাবে রেজিস্ট্রেশন হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SM World Store
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              আপনার অ্যাকাউন্টে প্রবেশ করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all"
                >
                  লগইন
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all"
                >
                  রেজিস্ট্রেশন
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <motion.form
                  onSubmit={handleLogin}
                  className="space-y-4 mt-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="আপনার ইমেইল"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">পাসওয়ার্ড</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="আপনার পাসওয়ার্ড"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500 pr-10"
                    />
                    <span
                      className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-purple-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all rounded-xl shadow-lg"
                    disabled={loading}
                  >
                    {loading ? "অপেক্ষা করুন..." : "লগইন"}
                  </Button>
                </motion.form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <motion.form
                  onSubmit={handleSignup}
                  className="space-y-4 mt-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">পূর্ণ নাম</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="আপনার পূর্ণ নাম"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">ইমেইল</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="আপনার ইমেইল"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="আপনার পাসওয়ার্ড"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500 pr-10"
                    />
                    <span
                      className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-purple-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</Label>
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="focus:ring-2 focus:ring-purple-500 pr-10"
                    />
                    <span
                      className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-purple-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all rounded-xl shadow-lg"
                    disabled={loading}
                  >
                    {loading ? "অপেক্ষা করুন..." : "রেজিস্ট্রেশন"}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
