import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

import {
  BarChart,
  Bar,
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
} from 'recharts';

import { AlertTriangle, Users, TrendingUp, MapPin } from 'lucide-react';

/* =====================
   Dummy Data (Exam Use)
===================== */

const incidentTypeData = [
  { name: 'Crime', value: 45 },
  { name: 'Accident', value: 30 },
  { name: 'Suspicious', value: 15 },
  { name: 'Hazard', value: 10 },
];

const monthlyData = [
  { month: 'Jan', incidents: 120 },
  { month: 'Feb', incidents: 145 },
  { month: 'Mar', incidents: 180 },
  { month: 'Apr', incidents: 160 },
  { month: 'May', incidents: 200 },
  { month: 'Jun', incidents: 175 },
];

const hotspotData = [
  { area: 'Dhanmondi', incidents: 156 },
  { area: 'Mirpur', incidents: 134 },
  { area: 'Uttara', incidents: 98 },
  { area: 'Gulshan', incidents: 87 },
];

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

/* =====================
   Component
===================== */

export function AnalyticsDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ===== Top Statistics ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">

        <Card>
          <CardHeader className="flex flex-row justify-between items-start p-3 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm">Total Incidents</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <h2 className="text-xl sm:text-2xl font-bold">544</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-start p-3 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm">Active Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <h2 className="text-xl sm:text-2xl font-bold">2,847</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-start p-3 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm">Resolution Rate</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <h2 className="text-xl sm:text-2xl font-bold">94%</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Successfully handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-start p-3 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm">Risk Areas</CardTitle>
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <h2 className="text-xl sm:text-2xl font-bold">8</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              High-risk zones
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ===== Charts ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Line Chart */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Monthly Incidents</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Incident trend by month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Incident Types</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Percentage by category
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.name}
                >
                  {incidentTypeData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* ===== Hotspot Bar Chart ===== */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Incident Hotspots</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Areas with highest incidents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={hotspotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="incidents" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
