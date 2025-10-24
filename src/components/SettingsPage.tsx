import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Save, Building2, MapPin, Users, Plus, Trash2, Edit, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Emily Rodriguez', email: 'emily@company.com', role: 'Technician', status: 'Active' },
  { id: '3', name: 'David Kim', email: 'david@company.com', role: 'Technician', status: 'Active' },
];

const mockLocations = [
  { id: '1', name: 'Main Shop', address: '123 Industrial Way, San Francisco, CA', type: 'Shop' },
  { id: '2', name: 'Truck 1 - John Smith', address: 'Mobile Unit', type: 'Truck' },
  { id: '3', name: 'Truck 2 - Emily Rodriguez', address: 'Mobile Unit', type: 'Truck' },
  { id: '4', name: 'Secure Storage', address: '456 Storage Rd, Oakland, CA', type: 'Warehouse' },
];

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface LocationFormData {
  name: string;
  address: string;
  type: string;
}

export function SettingsPage() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Technician',
    status: 'Active',
  });

  const [locationFormData, setLocationFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    type: 'Shop',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleInviteUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      role: 'Technician',
      status: 'Active',
    });
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.name || !userFormData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    if (editingUser) {
      toast.success('User updated successfully');
    } else {
      toast.success('Invitation sent successfully');
    }
    setUserDialogOpen(false);
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setLocationFormData({
      name: '',
      address: '',
      type: 'Shop',
    });
    setLocationDialogOpen(true);
  };

  const handleEditLocation = (location: any) => {
    setEditingLocation(location);
    setLocationFormData({
      name: location.name,
      address: location.address,
      type: location.type,
    });
    setLocationDialogOpen(true);
  };

  const handleSaveLocation = () => {
    if (!locationFormData.name) {
      toast.error('Please fill in required fields');
      return;
    }
    if (editingLocation) {
      toast.success('Location updated successfully');
    } else {
      toast.success('Location added successfully');
    }
    setLocationDialogOpen(false);
  };

  const handleDeleteLocation = (locationId: string) => {
    toast.success('Location deleted successfully');
  };

  return (
    <div className="space-y-6 h-full">
      <div>
        <h2 className="text-slate-900 mb-1">Settings</h2>
        <p className="text-slate-600">Manage your business settings and users</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Team Members</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle>Company Information</CardTitle>
              </div>
              <CardDescription>Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Autopilot HVAC Services" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@autopilot.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" defaultValue="https://autopilot.com" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Industrial Way" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="San Francisco" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" defaultValue="94102" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Company Info
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <CardTitle>Team Members</CardTitle>
                  </div>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button onClick={handleInviteUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg gap-3">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 truncate">{user.name}</p>
                        <p className="text-sm text-slate-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="secondary">{user.role}</Badge>
                      <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <CardTitle>Business Locations</CardTitle>
                  </div>
                  <CardDescription>Shops, warehouses, and mobile units</CardDescription>
                </div>
                <Button onClick={handleAddLocation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLocations.map((location) => (
                  <div key={location.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-4 bg-slate-50 rounded-lg gap-3">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-green-100 shrink-0">
                        {location.type === 'Truck' ? (
                          <span className="text-lg">🚚</span>
                        ) : location.type === 'Warehouse' ? (
                          <span className="text-lg">📦</span>
                        ) : (
                          <Building2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-slate-900">{location.name}</p>
                          <Badge variant="outline">{location.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{location.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Invite Team Member'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information and permissions' : 'Send an invitation to join your team'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name *</Label>
              <Input
                id="user-name"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={userFormData.role}
                onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={userFormData.status}
                  onValueChange={(value) => setUserFormData({ ...userFormData, status: value })}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              <Mail className="h-4 w-4 mr-2" />
              {editingUser ? 'Update User' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation ? 'Update location information' : 'Add a new business location'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Location Name *</Label>
              <Input
                id="location-name"
                value={locationFormData.name}
                onChange={(e) => setLocationFormData({ ...locationFormData, name: e.target.value })}
                placeholder="Main Shop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-type">Type</Label>
              <Select
                value={locationFormData.type}
                onValueChange={(value) => setLocationFormData({ ...locationFormData, type: value })}
              >
                <SelectTrigger id="location-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shop">Shop</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Truck">Mobile Unit (Truck)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-address">Address</Label>
              <Input
                id="location-address"
                value={locationFormData.address}
                onChange={(e) => setLocationFormData({ ...locationFormData, address: e.target.value })}
                placeholder="123 Industrial Way, San Francisco, CA"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation}>
              {editingLocation ? 'Update Location' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
