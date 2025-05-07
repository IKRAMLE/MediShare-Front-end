import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, UserPlus, Package, AlertCircle } from 'lucide-react';

const NotificationItem = ({ type, message, timestamp }) => {
  const getIcon = () => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'equipment':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0">
      <div className="mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm text-gray-900">{message}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};

const Notifications = ({ notifications = [] }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Recent Activities</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recent notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                type={notification.type}
                message={notification.message}
                timestamp={notification.timestamp}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications; 