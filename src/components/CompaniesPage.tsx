import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
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
import { mockCompanies } from '../lib/mockData';
import { Building2, Search, Plus, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'active' | 'inactive';
}

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: 'active',
  });

  const filteredCompanies = mockCompanies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      status: 'active',
    });
    setDialogOpen(true);
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      city: company.city,
      state: company.state,
      zip: company.zip,
      status: company.status,
    });
    setDialogOpen(true);
  };

  const handleSaveCompany = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    
    if (editingCompany) {
      toast.success('Company updated successfully');
    } else {
      toast.success('Company created successfully');
    }
    setDialogOpen(false);
  };

  const handleDeleteCompany = (companyId: string) => {
    toast.success('Company deleted successfully');
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Platform Companies</h2>
          <p className="text-slate-600">Manage companies using Autopilot OS and monitor their usage</p>
        </div>
        <Button onClick={handleAddCompany}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search companies by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-slate-900 mb-2 truncate">{company.name}</CardTitle>
                    <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                      {company.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{company.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{company.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-600">
                  {company.address}, {company.city}, {company.state} {company.zip}
                </span>
              </div>
              <div className="pt-3 border-t flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Jobs</p>
                  <p className="text-slate-900">{company.total_jobs}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Revenue</p>
                  <p className="text-slate-900">{formatCurrency(company.revenue)}</p>
                </div>
              </div>
              <div className="pt-3 border-t flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditCompany(company)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteCompany(company.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No companies found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Company Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
            <DialogDescription>
              {editingCompany ? 'Update company information' : 'Enter the details for the new company'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="company@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  placeholder="94102"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompany}>
              {editingCompany ? 'Update Company' : 'Create Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
