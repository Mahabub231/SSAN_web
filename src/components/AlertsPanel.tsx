import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "info" | "danger" | "success";
  distance: string;
  timestamp: string;
  location: string;
}

const recentAlerts: Alert[] = [
  {
    id: "1",
    title: "Suspicious Activity Reported",
    description:
      "Multiple reports of suspicious behavior in the area",
    type: "warning",
    distance: "0.5 km away",
    timestamp: "5 min ago",
    location: "Dhanmondi, Dhaka",
  },
  {
    id: "2",
    title: "Traffic Accident",
    description:
      "Major traffic disruption due to accident on road",
    type: "danger",
    distance: "2 km away",
    timestamp: "15 min ago",
    location: "Gulshan Circle 1, Dhaka",
  },
  {
    id: "3",
    title: "Community Safety Event",
    description:
      "Free self-defense workshop at Community Center",
    type: "info",
    distance: "1.3 km away",
    timestamp: "1 hour ago",
    location: "Uttara Community Center",
  },
  {
    id: "4",
    title: "Incident Resolved",
    description: "Previously reported hazard has been cleared",
    type: "success",
    distance: "0.8 km away",
    timestamp: "2 hours ago",
    location: "Banani, Dhaka",
  },
  {
    id: "5",
    title: "Weather Alert",
    description: "Heavy rainfall warning in effect until 6 PM",
    type: "warning",
    distance: "Your area",
    timestamp: "3 hours ago",
    location: "Dhaka Metropolitan",
  },
  {
    id: "6",
    title: "Road Hazard",
    description: "Waterlogging reported on main road",
    type: "warning",
    distance: "3 km away",
    timestamp: "4 hours ago",
    location: "Mirpur-10, Dhaka",
  },
];

export function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return (
          <AlertTriangle className="h-5 w-5 text-red-600" />
        );
      case "warning":
        return (
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        );
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "success":
        return (
          <CheckCircle className="h-5 w-5 text-green-600" />
        );
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "default";
      case "success":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 sm:p-6">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Real-Time Alerts</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Location-based safety notifications
            </CardDescription>
          </div>
          <Badge
            variant="destructive"
            className="animate-pulse text-[10px] sm:text-xs flex-shrink-0"
          >
            {recentAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
          <div className="space-y-2 sm:space-y-3">
            {recentAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`${getAlertColor(alert.type)} border`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm break-words">
                          {alert.title}
                        </h4>
                        <Badge
                          variant={getBadgeVariant(alert.type)}
                          className="text-[10px] sm:text-xs flex-shrink-0"
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {alert.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 break-words">
                          📍 {alert.location}
                        </span>
                        <span className="flex-shrink-0">{alert.distance}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}