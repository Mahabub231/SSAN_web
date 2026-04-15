import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { AlertTriangle, Users, TrendingUp, MapPin } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  role: "admin" | "user";
};

export function AnalyticsDashboard({ role }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  /* ================= FIREBASE LOAD ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const incidentSnap = await getDocs(collection(db, "incidents"));

        setUsers(userSnap.docs.map((d) => d.data()));
        setIncidents(incidentSnap.docs.map((d) => d.data()));
      } catch (err) {
        console.error("Firebase error:", err);
      }
    };

    fetchData();
  }, []);

  /* ================= ADMIN CHECK ================= */
  if (role !== "admin") {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Access Denied 🚫 Admin Only
      </div>
    );
  }

  /* ================= SAFE DATA ================= */
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  const totalUsers = users?.length || 0;
  const totalIncidents = safeIncidents.length;

  const crimeCount = safeIncidents.filter((i) => i?.type === "Crime").length;
  const accidentCount = safeIncidents.filter((i) => i?.type === "Accident").length;
  const suspiciousCount = safeIncidents.filter((i) => i?.type === "Suspicious").length;

  const riskAreas = new Set(
    safeIncidents.map((i) => i?.area || "Unknown")
  ).size;

  /* ================= CHART DATA ================= */

  const incidentTypeData = [
    { name: "Crime", value: crimeCount },
    { name: "Accident", value: accidentCount },
    { name: "Suspicious", value: suspiciousCount },
  ];

  const monthlyData = [
    { month: "Total", incidents: totalIncidents },
  ];

  const hotspotData = useMemo(() => {
    const map: Record<string, number> = {};

    safeIncidents.forEach((i) => {
      const area = i?.area || "Unknown";
      map[area] = (map[area] || 0) + 1;
    });

    return Object.entries(map).map(([area, count]) => ({
      area,
      incidents: count,
    }));
  }, [safeIncidents]);

  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Total Incidents</CardTitle>
            <AlertTriangle className="text-red-500" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{totalIncidents}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <Users className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate</CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">94%</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Areas</CardTitle>
            <MapPin className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{riskAreas}</h2>
          </CardContent>
        </Card>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LINE */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents Overview</CardTitle>
            <CardDescription>Live Firebase data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="incidents" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PIE */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {incidentTypeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* BAR */}
      <Card>
        <CardHeader>
          <CardTitle>Hotspot Areas</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hotspotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}