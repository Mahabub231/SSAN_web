import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";

/* ==============================
   Emergency Service Interface
================================ */
interface EmergencyService {
  id: string;
  name: string;
  type: "police" | "hospital" | "fire";
  address: string;
  phone: string;
  distance: string;
  lat: number;
  lng: number;
}

/* ==============================
   Dummy Emergency Services
================================ */
const emergencyServices: EmergencyService[] = [
  {
    id: "1",
    name: "Dhanmondi Police Station",
    type: "police",
    address: "Road 27, Dhanmondi, Dhaka-1209",
    phone: "999",
    distance: "0.8 km",
    lat: 23.7465,
    lng: 90.376,
  },
  {
    id: "2",
    name: "Dhaka Medical College Hospital",
    type: "hospital",
    address: "Secretariat Road, Dhaka-1000",
    phone: "999",
    distance: "1.2 km",
    lat: 23.725,
    lng: 90.3964,
  },
  {
    id: "3",
    name: "Fire Service & Civil Defence",
    type: "fire",
    address: "Kakrail, Dhaka-1000",
    phone: "999",
    distance: "0.5 km",
    lat: 23.7356,
    lng: 90.4125,
  },
  {
    id: "4",
    name: "Gulshan Police Station",
    type: "police",
    address: "Gulshan Avenue, Dhaka-1212",
    phone: "999",
    distance: "2.5 km",
    lat: 23.7808,
    lng: 90.4172,
  },
  {
    id: "5",
    name: "Square Hospital",
    type: "hospital",
    address: "18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka-1205",
    phone: "02-8159457",
    distance: "1.8 km",
    lat: 23.753,
    lng: 90.3915,
  },
  {
    id: "6",
    name: "Mirpur Fire Station",
    type: "fire",
    address: "Mirpur-10, Dhaka-1216",
    phone: "999",
    distance: "3.2 km",
    lat: 23.8067,
    lng: 90.3685,
  },
];

/* ==============================
   Main Component
================================ */
export function EmergencyLocator() {
  /* User GPS Location */
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  /* Admin Emergency Alert */
  const [adminAlert] = useState<string>(
    "Accident reported nearby. Please stay alert.",
  );

  /* ==============================
     Get User Location (GPS)
  ================================ */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Location access denied");
        },
      );
    }
  }, []);

  /* ==============================
     Helper Functions
  ================================ */
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  const getIcon = (type: string) => {
    if (type === "police") return "🚔";
    if (type === "hospital") return "🏥";
    if (type === "fire") return "🚒";
    return "";
  };

  /* ==============================
     UI
  ================================ */
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Admin Alert */}
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-yellow-800 text-base sm:text-lg">
            Emergency Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700 text-sm p-3 sm:p-6 pt-0 sm:pt-0">
          {adminAlert}
        </CardContent>
      </Card>

      {/* Main Emergency Call */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-red-800 text-base sm:text-lg">
            Emergency Contact
          </CardTitle>
          <CardDescription className="text-sm">
            Call 999 for any serious emergency
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-14 sm:h-16 text-base sm:text-lg"
            onClick={() => handleCall("999")}
          >
            <Phone className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            Call 999
          </Button>
        </CardContent>
      </Card>

      {/* User Location Map */}
      {userLocation && (
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Your Location</CardTitle>
            <CardDescription className="text-sm">Live GPS location</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <iframe
              title="User Location Map"
              className="w-full rounded-lg"
              height="250"
              loading="lazy"
              src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=15&output=embed`}
            />
          </CardContent>
        </Card>
      )}

      {/* Nearby Services */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold px-1">
          Nearby Emergency Services
        </h3>

        {emergencyServices.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0">
                  {getIcon(service.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1 sm:gap-2">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">
                        {service.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {service.type} service
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm bg-blue-100 px-2 py-1 rounded self-start">
                      {service.distance}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-xs sm:text-sm mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{service.address}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleCall(service.phone)}
                    >
                      <Phone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Call
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() =>
                        handleDirections(
                          service.lat,
                          service.lng,
                        )
                      }
                    >
                      <Navigation className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}