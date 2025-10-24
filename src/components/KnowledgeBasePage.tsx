import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  Link2, 
  FileText, 
  Type, 
  Search, 
  Plus,
  MoreVertical,
  Database,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

type KnowledgeType = 'url' | 'file' | 'text';

interface KnowledgeItem {
  id: string;
  name: string;
  type: KnowledgeType;
  created_by: string;
  last_updated: string;
  content: string;
  rag_indexes: string;
  dependent_agents: string[];
  size?: string;
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: 'KB-001',
    name: '9 Effective Sales Call Discovery Questions To Use In 2025',
    type: 'url',
    created_by: 'anthony@corporatesynergysolutions.com',
    last_updated: '2025-10-15T14:30:00Z',
    content: `# 9 Effective Sales Call Discovery Questions To Use In 2025

## What are sales discovery questions?

Sales discovery questions are open-ended questions that salespeople ask prospects during the initial stages of the sales process. These questions are designed to uncover the prospect's needs, challenges, goals, and decision-making process.

The purpose of discovery questions is to gather information that will help you:
- Understand if your solution is a good fit
- Identify pain points you can solve
- Build rapport and trust
- Qualify the lead properly
- Tailor your pitch to their specific needs

## The 9 Most Effective Discovery Questions

### 1. "What prompted you to look into this now?"
This question helps you understand the urgency and timing. It reveals what triggered their search and whether they have a pressing need or are just exploring options.

### 2. "What are your biggest challenges with [current situation]?"
Directly asks about pain points. This is where you identify problems that your solution can address.

### 3. "How are you currently handling [process/problem]?"
Gives you insight into their current workflow and helps you position your solution as an improvement.

### 4. "What would an ideal solution look like for you?"
Lets the prospect paint a picture of success, which you can then align with your offering.

### 5. "Who else is involved in making this decision?"
Critical for B2B sales. You need to know all stakeholders to close the deal.

### 6. "What's your timeline for implementing a solution?"
Helps you understand urgency and prioritize your follow-up efforts.

### 7. "What happens if you don't solve this problem?"
Creates urgency by highlighting the cost of inaction.

### 8. "Have you looked at other solutions? What did you like or dislike?"
Reveals competitors and objections you'll need to address.

### 9. "What questions do you have for me?"
Opens the floor and shows you're collaborative, not just pitching.

## Best Practices

- Ask follow-up questions to dig deeper
- Listen more than you talk (80/20 rule)
- Take detailed notes
- Be genuinely curious
- Don't rush to pitch your solution`,
    rag_indexes: 'No indexes',
    dependent_agents: ['Sales agent'],
  },
  {
    id: 'KB-002',
    name: 'HVAC Maintenance Schedule 2025',
    type: 'file',
    created_by: 'john.smith@autopilot.com',
    last_updated: '2025-10-20T09:15:00Z',
    content: `# HVAC Maintenance Schedule 2025

## Quarterly Maintenance Tasks

### Q1 (January - March)
- Inspect and clean air filters
- Check thermostat calibration
- Inspect electrical connections
- Test safety controls
- Lubricate moving parts
- Check refrigerant levels

### Q2 (April - June)
- Clean condenser coils
- Check drain lines
- Inspect ductwork for leaks
- Test compressor performance
- Verify proper airflow
- Replace worn belts

### Q3 (July - September)
- Pre-cooling season inspection
- Clean evaporator coils
- Check capacitors
- Inspect insulation
- Test emergency shutoff
- Verify proper ventilation

### Q4 (October - December)
- Pre-heating season inspection
- Check heat exchanger
- Inspect burner assembly
- Test ignition system
- Check gas connections
- Verify carbon monoxide detectors

## Safety Guidelines

Always follow manufacturer specifications and local codes. Ensure proper PPE is used for all maintenance tasks.`,
    rag_indexes: '2 indexes',
    dependent_agents: ['AI Foreman', 'Technician Assistant'],
    size: '2.4 MB',
  },
  {
    id: 'KB-003',
    name: 'Emergency Response Protocol',
    type: 'text',
    created_by: 'emily.rodriguez@autopilot.com',
    last_updated: '2025-10-18T16:45:00Z',
    content: `# Emergency Response Protocol

## Immediate Actions

1. **Safety First**: Ensure the safety of all personnel and customers
2. **Assess Situation**: Quickly evaluate the severity of the emergency
3. **Contact Dispatch**: Notify central dispatch immediately
4. **Secure Area**: If necessary, cordon off dangerous areas

## Emergency Categories

### Category 1: Life-Threatening
- Gas leaks
- Electrical hazards
- Carbon monoxide detection
- Fire hazards

**Response Time**: Immediate (within 1 hour)

### Category 2: Service Failure
- Complete HVAC system failure
- Major water leaks
- Power outages affecting critical systems

**Response Time**: Same day (within 4 hours)

### Category 3: Urgent Repairs
- Partial system failures
- Performance issues
- Minor leaks

**Response Time**: Within 24 hours

## Contact Information

Emergency Dispatch: (555) 911-HVAC
After Hours Supervisor: (555) 123-4567
Safety Manager: (555) 234-5678`,
    rag_indexes: '1 index',
    dependent_agents: ['AI Receptionist', 'AI Foreman'],
  },
  {
    id: 'KB-004',
    name: 'Industry Best Practices - HVAC Installation',
    type: 'url',
    created_by: 'david.kim@autopilot.com',
    last_updated: '2025-10-12T11:20:00Z',
    content: `# Industry Best Practices for HVAC Installation

## Pre-Installation Checklist

- Verify equipment specifications match customer requirements
- Conduct site survey for optimal placement
- Check electrical capacity and requirements
- Ensure proper ventilation paths
- Review local building codes and permits

## Installation Guidelines

### Equipment Placement
- Maintain minimum clearances per manufacturer specs
- Ensure level mounting surfaces
- Provide adequate drainage
- Consider noise levels and customer comfort

### Electrical Connections
- Use appropriate wire gauges
- Install dedicated circuits when required
- Verify proper grounding
- Test all connections before startup

### Refrigerant Lines
- Use proper insulation
- Minimize line lengths when possible
- Avoid sharp bends
- Pressure test before charging

## Quality Assurance

- Perform system startup procedures
- Verify proper airflow (CFM measurements)
- Check for leaks (soap test or electronic detector)
- Document all settings and measurements
- Provide customer training on system operation`,
    rag_indexes: '3 indexes',
    dependent_agents: ['AI Foreman', 'Technician Assistant', 'Quality Assurance Agent'],
  },
  {
    id: 'KB-005',
    name: 'Customer Service Guidelines',
    type: 'text',
    created_by: 'sarah.johnson@autopilot.com',
    last_updated: '2025-10-10T08:30:00Z',
    content: `# Customer Service Guidelines

## Core Principles

1. **Professionalism**: Always maintain a professional demeanor
2. **Respect**: Treat every customer with respect and courtesy
3. **Communication**: Provide clear, timely updates
4. **Quality**: Deliver exceptional service every time

## Phone Etiquette

- Answer within 3 rings
- Greet warmly: "Thank you for calling [Company Name], this is [Your Name], how may I help you?"
- Listen actively without interrupting
- Use customer's name throughout conversation
- Summarize action items before ending call

## On-Site Conduct

- Arrive within scheduled window
- Wear clean, branded uniform
- Use shoe covers in customer homes
- Explain work before starting
- Clean work area thoroughly
- Demonstrate system operation to customer

## Handling Complaints

1. Listen without defensiveness
2. Apologize sincerely
3. Take ownership of the issue
4. Propose a solution
5. Follow up to ensure satisfaction

## Documentation

- Take before/after photos when appropriate
- Document all work performed
- Note any recommendations for future service
- Obtain customer signature on completed work`,
    rag_indexes: 'No indexes',
    dependent_agents: ['AI Receptionist', 'Sales agent'],
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTypeIcon = (type: KnowledgeType) => {
  switch (type) {
    case 'url':
      return <Link2 className="h-4 w-4 text-blue-600" />;
    case 'file':
      return <FileText className="h-4 w-4 text-green-600" />;
    case 'text':
      return <Type className="h-4 w-4 text-purple-600" />;
  }
};

const calculateStorageUsed = () => {
  const bytesUsed = mockKnowledgeItems.reduce((total, item) => {
    if (item.size) {
      const size = parseFloat(item.size);
      return total + (size * 1024 * 1024); // Convert MB to bytes
    }
    return total + (item.content.length * 2); // Approximate 2 bytes per character
  }, 0);
  
  const mbUsed = (bytesUsed / (1024 * 1024)).toFixed(1);
  return `${mbUsed} MB`;
};

const availableAgents = [
  'AI Receptionist',
  'AI Foreman',
  'AI Service Rep',
  'AI Inventory Manager',
];

export function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | 'all'>('all');
  
  // Dialog states
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  
  // Form states
  const [urlFormData, setUrlFormData] = useState({ name: '', url: '', agents: [] as string[] });
  const [textFormData, setTextFormData] = useState({ name: '', content: '', agents: [] as string[] });
  const [fileAgents, setFileAgents] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const filteredItems = mockKnowledgeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    toast.success('Item deleted successfully');
    setSelectedItem(null);
  };

  const handleEdit = (id: string) => {
    toast.info('Edit functionality coming soon');
  };

  const toggleUrlAgent = (agent: string) => {
    setUrlFormData(prev => ({
      ...prev,
      agents: prev.agents.includes(agent)
        ? prev.agents.filter(a => a !== agent)
        : [...prev.agents, agent]
    }));
  };

  const toggleTextAgent = (agent: string) => {
    setTextFormData(prev => ({
      ...prev,
      agents: prev.agents.includes(agent)
        ? prev.agents.filter(a => a !== agent)
        : [...prev.agents, agent]
    }));
  };

  const toggleFileAgent = (agent: string) => {
    setFileAgents(prev =>
      prev.includes(agent)
        ? prev.filter(a => a !== agent)
        : [...prev, agent]
    );
  };

  const handleAddUrl = () => {
    if (!urlFormData.name || !urlFormData.url) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`URL "${urlFormData.name}" added to knowledge base`);
    setUrlFormData({ name: '', url: '', agents: [] });
    setUrlDialogOpen(false);
  };

  const handleAddFiles = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    toast.success(`${selectedFiles.length} file(s) uploaded successfully`);
    setSelectedFiles(null);
    setFileAgents([]);
    setFileDialogOpen(false);
  };

  const handleCreateText = () => {
    if (!textFormData.name || !textFormData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Text document "${textFormData.name}" created successfully`);
    setTextFormData({ name: '', content: '', agents: [] });
    setTextDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-1">Knowledge Base</h2>
          <p className="text-slate-600">Manage your AI training resources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
            <Database className="h-4 w-4 text-slate-600" />
            <span className="text-sm text-slate-700">RAG Storage:</span>
            <span className="text-sm text-slate-900">{calculateStorageUsed()} / 104.9 MB</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setUrlDialogOpen(true)}>
          <Link2 className="h-4 w-4 mr-2" />
          Add URL
        </Button>
        <Button variant="outline" onClick={() => setFileDialogOpen(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Add Files
        </Button>
        <Button variant="outline" onClick={() => setTextDialogOpen(true)}>
          <Type className="h-4 w-4 mr-2" />
          Create Text
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search Knowledge Base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('url')}>
                  <Link2 className="h-4 w-4 mr-2" />
                  URLs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('file')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('text')}>
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left text-slate-700">Created by</th>
                  <th className="px-6 py-3 text-left text-slate-700">Last updated</th>
                  <th className="px-6 py-3 text-left text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <span className="text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{item.created_by}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{formatDate(item.last_updated)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.id);
                          }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No items found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="sm:max-w-[800px] w-full">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedItem.type)}
                  {selectedItem.name}
                </SheetTitle>
                <SheetDescription>
                  View details and content for this knowledge base item
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Document ID</p>
                    <p className="text-sm text-slate-900">{selectedItem.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Last updated</p>
                    <p className="text-sm text-slate-900">{formatDate(selectedItem.last_updated)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">RAG indexes</p>
                    <p className="text-sm text-slate-900">{selectedItem.rag_indexes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Dependent agents</p>
                    <div className="space-y-2 mt-2">
                      {selectedItem.dependent_agents.map((agent) => (
                        <Badge key={agent} variant="secondary" className="block w-fit">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <h3 className="text-slate-900 mb-3">
                    {selectedItem.type === 'url' ? 'URL Content' : 'Content'}
                  </h3>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {selectedItem.content}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add URL Dialog */}
      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add URL to Knowledge Base</DialogTitle>
            <DialogDescription>
              Add a URL that will be crawled and indexed for AI training
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url-name">Display Name *</Label>
              <Input
                id="url-name"
                placeholder="e.g., Sales Discovery Questions"
                value={urlFormData.name}
                onChange={(e) => setUrlFormData({ ...urlFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url-input">URL *</Label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/article"
                value={urlFormData.url}
                onChange={(e) => setUrlFormData({ ...urlFormData, url: e.target.value })}
              />
              <p className="text-xs text-slate-500">
                The URL content will be automatically extracted and indexed
              </p>
            </div>

            <div className="space-y-3">
              <Label>Dependent Agents (Optional)</Label>
              <div className="space-y-3 border rounded-lg p-4 bg-slate-50">
                {availableAgents.map((agent) => (
                  <div key={agent} className="flex items-center space-x-2">
                    <Checkbox
                      id={`url-agent-${agent}`}
                      checked={urlFormData.agents.includes(agent)}
                      onCheckedChange={() => toggleUrlAgent(agent)}
                    />
                    <label
                      htmlFor={`url-agent-${agent}`}
                      className="text-sm text-slate-700 cursor-pointer"
                    >
                      {agent}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Select which AI agents will have access to this knowledge
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUrlDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUrl}>
              <Link2 className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Files Dialog */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files to Knowledge Base</DialogTitle>
            <DialogDescription>
              Upload documents that will be processed and indexed for AI training
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">Select Files *</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, DOC, DOCX, TXT, MD (max 10MB each)
                  </p>
                </label>
              </div>
              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-slate-700">Selected files:</p>
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                      <FileText className="h-3 w-3" />
                      <span>{file.name}</span>
                      <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Dependent Agents (Optional)</Label>
              <div className="space-y-3 border rounded-lg p-4 bg-slate-50">
                {availableAgents.map((agent) => (
                  <div key={agent} className="flex items-center space-x-2">
                    <Checkbox
                      id={`file-agent-${agent}`}
                      checked={fileAgents.includes(agent)}
                      onCheckedChange={() => toggleFileAgent(agent)}
                    />
                    <label
                      htmlFor={`file-agent-${agent}`}
                      className="text-sm text-slate-700 cursor-pointer"
                    >
                      {agent}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Select which AI agents will have access to this knowledge
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Files will be automatically processed and indexed. 
                Text will be extracted and made available to selected AI agents.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFiles}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Text Dialog */}
      <Dialog open={textDialogOpen} onOpenChange={setTextDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Text Document</DialogTitle>
            <DialogDescription>
              Create a custom text document for AI training
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="text-name">Document Name *</Label>
              <Input
                id="text-name"
                placeholder="e.g., HVAC Installation Best Practices"
                value={textFormData.name}
                onChange={(e) => setTextFormData({ ...textFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-content">Content *</Label>
              <Textarea
                id="text-content"
                placeholder="Enter the document content here. You can use markdown formatting."
                rows={12}
                value={textFormData.content}
                onChange={(e) => setTextFormData({ ...textFormData, content: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                Markdown formatting supported. This content will be indexed and available to AI agents.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Dependent Agents (Optional)</Label>
              <div className="space-y-3 border rounded-lg p-4 bg-slate-50">
                {availableAgents.map((agent) => (
                  <div key={agent} className="flex items-center space-x-2">
                    <Checkbox
                      id={`text-agent-${agent}`}
                      checked={textFormData.agents.includes(agent)}
                      onCheckedChange={() => toggleTextAgent(agent)}
                    />
                    <label
                      htmlFor={`text-agent-${agent}`}
                      className="text-sm text-slate-700 cursor-pointer"
                    >
                      {agent}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Select which AI agents will have access to this knowledge
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTextDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateText}>
              <Type className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
