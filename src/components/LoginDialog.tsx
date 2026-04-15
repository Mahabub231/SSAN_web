import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { toast } from 'sonner';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, role: 'user' | 'admin') => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  // ================= REGISTER =================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name || "User",
        email,
        role: "user",
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      onOpenChange(false);
      resetFields();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔴 ADMIN LOGIN
// 🔴 ADMIN LOGIN (FIXED)
      if (email === "admin@ssan.com" && password === "admin1234") {
        toast.success("Welcome Admin");

        onLogin(email, password, "admin"); // 👈 IMPORTANT FIX

        onOpenChange(false);
        resetFields();
        return;
      }

      // 🟢 USER LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User not found");
        return;
      }

      const userData = userSnap.data();

      toast.success(`Welcome ${userData.name}`);
      onLogin(email, "user");

      onOpenChange(false);
      resetFields();

    } catch (error: any) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      // 🔥 CHECK EMAIL EXISTS IN FIRESTORE
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("This email is not registered");
        return;
      }

      // 🔥 SEND RESET EMAIL
      await sendPasswordResetEmail(auth, email);

      toast.success("Password reset link sent to email");
      setShowForgot(false);

    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[425px] mx-auto">

        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            Login, Register or Reset Password
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* ================= LOGIN ================= */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

            </form>
          </TabsContent>

          {/* ================= REGISTER ================= */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">

              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>

            </form>
          </TabsContent>

        </Tabs>

        {/* ================= FORGOT PASSWORD MODAL ================= */}
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-[300px] space-y-4">

              <h2 className="text-lg font-bold">Reset Password</h2>

              <p className="text-sm text-gray-500">
                Enter your email to receive reset link
              </p>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <div className="flex gap-2">
                <Button onClick={handleForgotPassword}>
                  Send
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowForgot(false)}
                >
                  Cancel
                </Button>
              </div>

            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}