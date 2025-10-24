import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Save, Wrench, Settings, ArrowLeft, User, Building2, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export function ForemanSettings() {
  const [customInstructions, setCustomInstructions] = useState(
    `1. Analyze Intent: Determine the user's need—whether it's for specific data from a tool or a general knowledge question.

2. Be Conversational: Maintain the context of the conversation and use history for follow-up questions.

3. Guide Diagnostics: Provide step-by-step guidance for troubleshooting, asking clarifying questions.

4. Use Tools When Necessary: If a query requires specific data, use the appropriate tool.

5. Format Your Output: Structure the response with specific data objects and a concise, natural language summary.`
  );

  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'tech-status',
      name: 'Get Technician Status',
      description: 'Look up a technician\'s current status and location',
      icon: User,
      enabled: true,
    },
    {
      id: 'customer-details',
      name: 'Get Customer Details',
      description: 'Retrieve a customer\'s contact information and job history',
      icon: Building2,
      enabled: true,
    },
    {
      id: 'job-invoice',
      name: 'Get Job Invoice',
      description: 'Get line items and totals for a specific invoice',
      icon: FileText,
      enabled: true,
    },
  ]);

  const handleSave = () => {
    toast.success('AI Foreman configuration saved successfully!');
  };

  const handleBack = () => {
    (window as any).navigateToPage?.('foreman');
  };

  const toggleTool = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  return (
    <div className="space-y-6 h-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-slate-900 mb-1">AI Foreman Configuration</h2>
          <p className="text-slate-600">Customize your AI assistant's knowledge and behavior</p>
        </div>
      </div>

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            <CardTitle>Custom Instructions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              placeholder="Enter custom instructions..."
            />
            <p className="text-sm text-slate-600 mt-3">
              This is the base prompt for the AI Foreman. You can modify its personality and rules here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tool Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <CardTitle>Tool Access</CardTitle>
          </div>
          <CardDescription>
            Grant the AI access to specific tools and data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 mb-1">{tool.name}</p>
                      <p className="text-sm text-slate-600">{tool.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={tool.enabled}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-slate-50 py-4 border-t">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
