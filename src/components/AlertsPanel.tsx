import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "info" | "danger" | "success";
  timestamp: string;
  location: string;
  lat: number;
  lng: number;
  distance?: string;

  imageUrl?: string;
  role?: "admin" | "user";
}


const initialAlerts: Alert[] = [
  {
    id: "1",
    title: "Suspicious Activity Reported",
    description: "Multiple reports of suspicious behavior in the area",
    type: "warning",
    timestamp: "5 min ago",
    location: "Dhanmondi, Dhaka",
    lat: 23.7465,
    lng: 90.3760,
  },
  {
    id: "2",
    title: "Traffic Accident",
    description: "Major traffic disruption due to accident on road",
    type: "danger",
    timestamp: "15 min ago",
    location: "Gulshan Circle 1, Dhaka",
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    id: "3",
    title: "Community Safety Event",
    description: "Free self-defense workshop at Community Center",
    type: "info",
    timestamp: "1 hour ago",
    location: "Uttara Community Center",
    lat: 23.8759,
    lng: 90.3795,
  },
];


export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      }
    );
  }, []);

  // Distance function (Haversine formula)
  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Add new alert function (USE THIS FROM YOUR REPORT FORM)
  const addNewAlert = (newAlert: Alert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const alertsWithDistance = useMemo(() => {
  return alerts
    .map((alert) => {
      if (!userLocation) {
        return { ...alert, distance: "Locating..." };
      }

      const km = getDistanceKm(
        userLocation.lat,
        userLocation.lng,
        alert.lat,
        alert.lng
      );

      return {
        ...alert,
        distance: `${km.toFixed(1)} km away`,
      };
    })
    .filter((alert: any) => {
      if (!userLocation) return true;

      if (!alert.distance || alert.distance === "Locating...") return false;

      const km = parseFloat(alert.distance.replace(" km away", ""));
      return km <= 30;
     });
    }, [alerts, userLocation]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
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
        return "secondary";
      case "info":
        return "outline";
      case "success":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-Time Alerts
        </CardTitle>
        <CardDescription>
          Location-based safety notifications
        </CardDescription>

        <Badge variant="destructive">
          {alerts.length} Active
        </Badge>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 pt-0">
        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-3">
            {alertsWithDistance.map((alert) => (
              <Card
                key={alert.id}
                className={`${getAlertColor(alert.type)} border`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {getAlertIcon(alert.type)}

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-sm">
                          {alert.title}
                        </h4>

                        <Badge variant={getBadgeVariant(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>

                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>📍 {alert.location}</span>
                        <span>{alert.distance}</span>
                      </div>

                      <div className="text-xs text-muted-foreground">
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

