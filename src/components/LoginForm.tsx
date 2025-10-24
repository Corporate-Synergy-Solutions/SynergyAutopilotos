import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const demoUsers = [
  { email: 'admin@company.com', password: 'admin123', role: 'Company Admin', description: 'Full access to Command Center and company management' },
  { email: 'tech@company.com', password: 'tech123', role: 'Technician', description: 'Access to Tech Hub and assigned jobs' },
  { email: 'sysadmin@autopilot.com', password: 'sysadmin123', role: 'System Admin', description: 'Platform-wide access to manage all companies' },
];

export function LoginForm() {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState('admin@company.com');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleRoleChange = (userEmail: string) => {
    const user = demoUsers.find(u => u.email === userEmail);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setSelectedRole(userEmail);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center">Autopilot OS</CardTitle>
          <CardDescription className="text-center">
            Sign in to your service management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Demo User Role</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {demoUsers.map((user) => (
                    <SelectItem key={user.email} value={user.email}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.role}</span>
                        <span className="text-xs text-slate-500">{user.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@autopilot.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Select a role above to see different access levels. Credentials auto-fill.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
