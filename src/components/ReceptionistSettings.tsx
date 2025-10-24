import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Save, Bell, Volume2, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ReceptionistSettings() {
  const [operatingMode, setOperatingMode] = useState('24/7');
  const [greetingMessage, setGreetingMessage] = useState(
    "Thank you for calling. I'm your AI assistant. How can I help you today?"
  );
  const [closingMessage, setClosingMessage] = useState(
    "Thank you for calling. We look forward to serving you!"
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [highValueThreshold, setHighValueThreshold] = useState('5000');

  const handleSave = () => {
    toast.success('Receptionist settings saved successfully!');
  };

  const handleBack = () => {
    (window as any).navigateToPage?.('receptionist');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-slate-900 mb-1">Receptionist Configuration</h2>
          <p className="text-slate-600">Customize your AI receptionist's behavior and settings</p>
        </div>
      </div>

      {/* Operating Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle>Operating Mode</CardTitle>
          </div>
          <CardDescription>Choose when the AI receptionist should handle calls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="operating-mode">Mode</Label>
            <Select value={operatingMode} onValueChange={setOperatingMode}>
              <SelectTrigger id="operating-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24/7">24/7 - Always Active</SelectItem>
                <SelectItem value="after-hours">After Hours Only</SelectItem>
                <SelectItem value="overflow">Overflow - When Team is Busy</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-1">
              {operatingMode === '24/7' && 'AI will handle all incoming calls at all times'}
              {operatingMode === 'after-hours' && 'AI activates outside of business hours (9 AM - 5 PM)'}
              {operatingMode === 'overflow' && 'AI only answers when human team is unavailable'}
              {operatingMode === 'disabled' && 'AI receptionist is turned off'}
            </p>
          </div>

          {operatingMode === 'after-hours' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <Label htmlFor="business-start">Business Hours Start</Label>
                <Input id="business-start" type="time" defaultValue="09:00" />
              </div>
              <div>
                <Label htmlFor="business-end">Business Hours End</Label>
                <Input id="business-end" type="time" defaultValue="17:00" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice & Personality */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-purple-600" />
            <CardTitle>Voice & Personality</CardTitle>
          </div>
          <CardDescription>Customize greeting and closing messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              rows={3}
              placeholder="Enter the greeting message customers will hear..."
            />
            <p className="text-sm text-slate-500 mt-1">
              First message customers hear when the AI answers
            </p>
          </div>

          <div>
            <Label htmlFor="closing">Closing Message</Label>
            <Textarea
              id="closing"
              value={closingMessage}
              onChange={(e) => setClosingMessage(e.target.value)}
              rows={3}
              placeholder="Enter the closing message..."
            />
            <p className="text-sm text-slate-500 mt-1">
              Final message before ending the call
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Use a friendly, professional tone that matches your company's brand. 
              Mention your company name in the greeting for a personal touch.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure alerts for important events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-500">
                Receive emails when appointments are booked
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="email-address">Notification Email</Label>
            <Input
              id="email-address"
              type="email"
              placeholder="admin@yourcompany.com"
              defaultValue="demo@autopilot.com"
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="high-value">High-Value Lead Threshold</Label>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">$</span>
              <Input
                id="high-value"
                type="number"
                value={highValueThreshold}
                onChange={(e) => setHighValueThreshold(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Get instant alerts for leads estimated above this value
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
