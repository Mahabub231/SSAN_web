import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Phone, Navigation } from "lucide-react";

/* =========================
   Types
========================= */
interface EmergencyService {
  id: string;
  name: string;
  type: "police" | "hospital" | "fire";
  subType?: "govt" | "private";
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

/* =========================
   Data
========================= */
const emergencyServices: EmergencyService[] = [
  { id: "p1", name: "Dhanmondi Police", type: "police", address: "Dhaka", phone: "999", lat: 23.7465, lng: 90.376 },
  { id: "p2", name: "Gulshan Police", type: "police", address: "Dhaka", phone: "999", lat: 23.7808, lng: 90.4172 },

  { id: "f1", name: "Fire Kakrail", type: "fire", address: "Dhaka", phone: "999", lat: 23.7356, lng: 90.4125 },
  { id: "f2", name: "Fire Mirpur", type: "fire", address: "Dhaka", phone: "999", lat: 23.8067, lng: 90.3685 },

  { id: "h1", name: "Dhaka Medical", type: "hospital", subType: "govt", address: "Dhaka", phone: "999", lat: 23.725, lng: 90.3964 },
  { id: "h2", name: "BSMMU", type: "hospital", subType: "govt", address: "Dhaka", phone: "999", lat: 23.738, lng: 90.394 },

  { id: "h3", name: "Square Hospital", type: "hospital", subType: "private", address: "Dhaka", phone: "02-8159457", lat: 23.753, lng: 90.3915 },
  { id: "h4", name: "Evercare", type: "hospital", subType: "private", address: "Dhaka", phone: "09666-710606", lat: 23.819, lng: 90.448 },
];

/* =========================
   Component
========================= */
export function EmergencyLocator() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  /* =========================
     GPS
  ========================== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  /* =========================
     Distance
  ========================== */
  const getDistance = (
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

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  /* =========================
     Filter + Sort
  ========================== */
  const getData = (type: string, subType?: string, limit = 4) => {
    if (!userLocation) return [];

    return emergencyServices
      .filter((s) =>
        subType ? s.type === type && s.subType === subType : s.type === type
      )
      .map((s) => {
        const distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          s.lat,
          s.lng
        );

        return { ...s, distance };
      })
      .filter((s) => s.distance >= 0 && s.distance <= 30)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  };

  /* =========================
     Groups
  ========================== */
  const police = getData("police", undefined, 4);
  const fire = getData("fire", undefined, 4);
  const hospitalGovt = getData("hospital", "govt", 2);
  const hospitalPrivate = getData("hospital", "private", 2);

  /* =========================
     Actions
  ========================== */
  const call = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const direction = (lat: number, lng: number) => {
    if (!userLocation) return;

    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`,
      "_blank"
    );
  };

  /* =========================
     Row UI
  ========================== */
  const Row = (title: string, data: any[]) => (
    <div className="w-full p-4 border rounded-lg bg-white space-y-4">
      <h2 className="font-bold">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">

              {/* Name */}
              <h4 className="font-semibold">{item.name}</h4>

              {/* Address */}
              <p className="text-xs text-gray-500">{item.address}</p>

              {/* PHONE + PUBLIC TAG */}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  📞 {item.phone}
                </span>

                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Public
                </span>
              </div>

              {/* Distance */}
              {userLocation && (
                <p
                  className={`text-xs mt-2 ${
                    item.distance <= 2
                      ? "text-red-600 font-bold"
                      : "text-blue-600"
                  }`}
                >
                  {item.distance.toFixed(2)} km away
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 h-9"
                  onClick={() => call(item.phone)}
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>

                <Button
                  className="flex-1 h-9"
                  onClick={() => direction(item.lat, item.lng)}
                >
                  <Navigation size={14} className="mr-1" />
                  Route
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  /* =========================
     UI
  ========================== */
  return (
    <div className="space-y-6">

      {/* EMERGENCY TOP CALL */}
      <Card className="border-red-500 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">
            🚨 Emergency Call
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full h-12 text-lg"
            onClick={() => call("999")}
          >
            <Phone className="mr-2" />
            Call 999 Now
          </Button>
        </CardContent>
      </Card>

      {/* MAP */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Your Location</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              className="w-full h-[250px] rounded-lg"
              src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=15&output=embed`}
            />
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      {Row("🚔 Nearby Police", police)}
      {Row("🚒 Fire Service", fire)}
      {Row("🏥 Govt Hospital", hospitalGovt)}
      {Row("🏥 Private Hospital", hospitalPrivate)}

    </div>
  );
}