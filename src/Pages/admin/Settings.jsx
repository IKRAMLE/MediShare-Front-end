import AdminLayout from "../../layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/Label";
import { Switch } from "../../Components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    platformName: '',
    contactEmail: '',
    platformDescription: '',
    maintenanceMode: false,
    userRegistration: true,
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    notifications: {
      newUserRegistration: true,
      newEquipmentListed: true,
      newRentalRequests: true,
      platformUpdates: false
    },
    security: {
      twoFactorAuth: true,
      passwordExpiration: false,
      loginAttempts: true,
      sessionTimeout: 30
    },
    api: {
      apiKey: '',
      apiAccess: true,
      rateLimit: 60
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (section, updates) => {
    try {
      setLoading(true);
      const response = await api.put('/settings', updates);
      setSettings(response.data);
      toast.success('Settings updated successfully');
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = async (section, field, value) => {
    try {
      setLoading(true);
      let updates = {};
      
      if (section === 'general') {
        updates = { [field]: value };
      } else if (section === 'notifications') {
        updates = {
          notifications: {
            ...settings.notifications,
            [field]: value
          }
        };
      } else if (section === 'security') {
        updates = {
          security: {
            ...settings.security,
            [field]: value
          }
        };
      } else if (section === 'api') {
        updates = {
          api: {
            ...settings.api,
            [field]: value
          }
        };
      }

      const response = await api.put('/settings', updates);
      setSettings(response.data);
      toast.success('Setting updated successfully');
    } catch (err) {
      console.error('Error updating setting:', err);
      toast.error('Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/regenerate-api-key');
      setSettings(prev => ({
        ...prev,
        api: {
          ...prev.api,
          apiKey: response.data.apiKey
        }
      }));
      toast.success('API key regenerated successfully');
    } catch (err) {
      console.error('Error regenerating API key:', err);
      toast.error('Failed to regenerate API key');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button 
              onClick={fetchSettings}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[#0d4071]">Admin Settings</h1>
        <p className="text-[#0070cc]">Manage platform settings and configurations</p>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure general platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input 
                      id="platform-name" 
                      value={settings.platformName}
                      onChange={(e) => setSettings(prev => ({ ...prev, platformName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      value={settings.contactEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Input 
                    id="platform-description" 
                    value={settings.platformDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, platformDescription: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                  </div>
                  <Switch 
                    id="maintenance-mode" 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSwitchChange('general', 'maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                  </div>
                  <Switch 
                    id="user-registration" 
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) => handleSwitchChange('general', 'userRegistration', checked)}
                  />
                </div>

                <Button 
                  className="mt-4 bg-blue-600 text-white"
                  onClick={() => handleSaveSettings('general', {
                    platformName: settings.platformName,
                    contactEmail: settings.contactEmail,
                    platformDescription: settings.platformDescription
                  })}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure regional and localization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                      value={settings.timezone}
                      onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <select
                      id="date-format"
                      className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                      value={settings.dateFormat}
                      onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
                      value={settings.currency}
                      onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="MAD">Moroccan Dirham (MAD)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  className="mt-4 bg-blue-600 text-white"
                  onClick={() => handleSaveSettings('regional', {
                    timezone: settings.timezone,
                    dateFormat: settings.dateFormat,
                    currency: settings.currency
                  })}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New User Registration</h4>
                      <p className="text-sm text-muted-foreground">Send notification when a new user registers</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.newUserRegistration}
                      onCheckedChange={(checked) => handleSwitchChange('notifications', 'newUserRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Equipment Listed</h4>
                      <p className="text-sm text-muted-foreground">Send notification when new equipment is listed</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.newEquipmentListed}
                      onCheckedChange={(checked) => handleSwitchChange('notifications', 'newEquipmentListed', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Rental Requests</h4>
                      <p className="text-sm text-muted-foreground">Send notification for new rental requests</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.newRentalRequests}
                      onCheckedChange={(checked) => handleSwitchChange('notifications', 'newRentalRequests', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Platform Updates</h4>
                      <p className="text-sm text-muted-foreground">Send notification about platform updates</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.platformUpdates}
                      onCheckedChange={(checked) => handleSwitchChange('notifications', 'platformUpdates', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch 
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleSwitchChange('security', 'twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Expiration</h4>
                      <p className="text-sm text-muted-foreground">Require password change every 90 days</p>
                    </div>
                    <Switch 
                      checked={settings.security.passwordExpiration}
                      onCheckedChange={(checked) => handleSwitchChange('security', 'passwordExpiration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Attempts</h4>
                      <p className="text-sm text-muted-foreground">Lock account after 5 failed attempts</p>
                    </div>
                    <Switch 
                      checked={settings.security.loginAttempts}
                      onCheckedChange={(checked) => handleSwitchChange('security', 'loginAttempts', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                  />
                </div>

                <Button 
                  className="mt-4 bg-blue-600 text-white"
                  onClick={() => handleSaveSettings('security', {
                    security: {
                      ...settings.security,
                      sessionTimeout: settings.security.sessionTimeout
                    }
                  })}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>Manage API access and keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={settings.api.apiKey} 
                      readOnly 
                      className="flex-1" 
                    />
                    <Button 
                      variant="outline"
                      onClick={handleRegenerateApiKey}
                    >
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(settings.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-access">API Access</Label>
                    <p className="text-sm text-muted-foreground">Enable API access for third-party integrations</p>
                  </div>
                  <Switch 
                    id="api-access" 
                    checked={settings.api.apiAccess}
                    onCheckedChange={(checked) => handleSwitchChange('api', 'apiAccess', checked)}
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="rate-limit">API Rate Limit (requests per minute)</Label>
                  <Input 
                    id="rate-limit" 
                    type="number" 
                    value={settings.api.rateLimit}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      api: { ...prev.api, rateLimit: parseInt(e.target.value) }
                    }))}
                  />
                </div>

                <Button 
                  className="mt-4 bg-blue-600 text-white"
                  onClick={() => handleSaveSettings('api', {
                    api: {
                      ...settings.api,
                      rateLimit: settings.api.rateLimit
                    }
                  })}
                >
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;