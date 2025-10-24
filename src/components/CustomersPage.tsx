import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { mockCustomers } from '../lib/mockData';
import { Users, Search, Plus, Mail, Phone, Building2, Clock, Edit, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
}

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: '',
    });
    setDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    if (isEditing) {
      toast.success('Customer updated successfully');
    } else {
      toast.success('Customer created successfully');
    }
    setDialogOpen(false);
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setIsEditing(true);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address || '',
      notes: customer.notes || '',
    });
    setSheetOpen(false);
    setDialogOpen(true);
  };

  const handleCreateJobForCustomer = (customer: any) => {
    setSheetOpen(false);
    toast.success(`Creating new job for ${customer.name}...`);
    // In a real app, this would navigate to the Jobs page with pre-filled customer data
    (window as any).navigateToPage?.('jobs');
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Customers</h2>
          <p className="text-slate-600">Manage customer relationships</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search customers by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-slate-900 mb-1 truncate">{customer.name}</CardTitle>
                  <p className="text-sm text-slate-600 truncate">{customer.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">Last contact: {formatDate(customer.last_contact)}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">Lifetime Value</span>
                  <span className="text-slate-900">{formatCurrency(customer.lifetime_value)}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewDetails(customer)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No customers found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the customer's information" : "Enter the customer's contact information"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                />
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
                  placeholder="john@example.com"
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
                placeholder="123 Main St, City, State ZIP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the customer"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {isEditing ? 'Update Customer' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[600px] w-full">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCustomer.name}</SheetTitle>
                <SheetDescription>Customer information and history</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                <div className="space-y-6 px-6">
                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{selectedCustomer.company}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-slate-600 mb-1">Total Jobs</p>
                          <p className="text-slate-900">{selectedCustomer.total_jobs}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-slate-600 mb-1">Lifetime Value</p>
                          <p className="text-slate-900">{formatCurrency(selectedCustomer.lifetime_value)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Last Contact</h3>
                    <p className="text-slate-900">{formatDate(selectedCustomer.last_contact)}</p>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full" onClick={() => handleEditCustomer(selectedCustomer)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Customer
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleCreateJobForCustomer(selectedCustomer)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Job for Customer
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
