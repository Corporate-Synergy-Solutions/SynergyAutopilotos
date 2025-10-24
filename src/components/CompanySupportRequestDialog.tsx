import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CompanySupportRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName?: string;
}

export function CompanySupportRequestDialog({ 
  open, 
  onOpenChange,
  agentName 
}: CompanySupportRequestDialogProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !category || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In production, this would submit to the company admin
    toast.success('Support request sent to your company admin');
    
    // Reset form
    setSubject('');
    setCategory('');
    setDescription('');
    setPriority('medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Request Support from Company Admin
          </DialogTitle>
          <DialogDescription>
            Submit a request for configuration changes or support to your company administrator
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-red-600">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={agentName ? `Request for ${agentName}` : 'Brief description of your request'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-600">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai_agent_config">AI Agent Configuration</SelectItem>
                <SelectItem value="knowledge_base">Knowledge Base Update</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
                <SelectItem value="access_request">Access Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Not urgent</SelectItem>
                <SelectItem value="medium">Medium - Normal priority</SelectItem>
                <SelectItem value="high">High - Needs attention soon</SelectItem>
                <SelectItem value="urgent">Urgent - Blocking work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about your request..."
              rows={6}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
