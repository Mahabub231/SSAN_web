import { useState } from "react";
import { LoginDialog } from "./components/LoginDialog";
import { SafetyMap } from "./components/SafetyMap";
import { IncidentReportForm } from "./components/IncidentReportForm";
import { SafetyChatbot } from "./components/SafetyChatbot";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { EmergencyLocator } from "./components/EmergencyLocator";
import { AlertsPanel } from "./components/AlertsPanel";

import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent } from "./components/ui/card";

import {
  ShieldAlert,
  Map,
  FileText,
  Bot,
  BarChart3,
  Phone,
  Bell,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import "./styles/leaflet.css";

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">(
    "user",
  );
  const [userEmail, setUserEmail] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Mobile responsive enhancements
  if (typeof document !== 'undefined') {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(meta);
    }
  }
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "1",
      lat: 23.8103,
      lng: 90.4125,
      type: "Crime",
      description: "Theft reported near Dhaka University",
      severity: "high",
    },
    {
      id: "2",
      lat: 23.7515,
      lng: 90.3776,
      type: "Accident",
      description: "Traffic accident at Gulshan Circle",
      severity: "medium",
    },
    {
      id: "3",
      lat: 23.855,
      lng: 90.3952,
      type: "Hazard",
      description: "Broken street light in Mirpur",
      severity: "low",
    },
    {
      id: "4",
      lat: 23.7272,
      lng: 90.4094,
      type: "Suspicious",
      description: "Suspicious activity in Motijheel",
      severity: "medium",
    },
  ]);


  const handleLogin = (
    email: string,
    password: string,
    role: "user" | "admin",
  ) => {
    const safeRole: "user" | "admin" =
      role === "admin" ? "admin" : "user";

    setIsAuthenticated(true);
    setUserRole(safeRole);
    setUserEmail(email);

    toast.success(`Welcome! Logged in as ${safeRole}`);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("user");
    setUserEmail("");
    toast.info("Logged out successfully");
  };

  const handleIncidentSubmit = (incident: any) => {
    const newIncident: Incident = {
      id: Date.now().toString(),
      lat: incident.lat,
      lng: incident.lng,
      type: incident.type,
      description: incident.description,
      severity: incident.severity,
    };

    setIncidents([...incidents, newIncident]);
    toast.success(
      "Incident reported successfully! Bangladesh Police have been notified.",
    );
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShieldAlert className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                  SSAN Bangladesh
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                  Smart Safety Awareness Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden lg:flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="text-gray-700 max-w-[150px] truncate">
                      {userEmail}
                    </span>
                    {userRole === "admin" && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 sm:h-10"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  size="sm"
                  className="h-8 sm:h-10"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 pb-20 sm:pb-8">
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-7 gap-1 sm:gap-2 h-auto p-1 bg-white shadow-sm">
            <TabsTrigger
              value="dashboard"
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
            >
              <Map className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">
                Map
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="alerts"
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
            >
              <Bell className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">Alerts</span>
            </TabsTrigger>

            {userRole !== "admin" && (
              <TabsTrigger
                value="report"
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
              >
                <FileText className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-sm">Report</span>
              </TabsTrigger>
            )}

            {userRole !== "admin" && (
              <TabsTrigger
                value="chatbot"
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
              >
                <Bot className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-sm">AI</span>
              </TabsTrigger>
            )}

            {userRole !== "admin" && (
              <TabsTrigger
                value="emergency"
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
              >
                <Phone className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-sm">SOS</span>
              </TabsTrigger>
            )}

            {isAuthenticated && userRole === "admin" && (
              <TabsTrigger
                value="analytics"
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
              >
                <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-sm">
                  Stats
                </span>
              </TabsTrigger>
            )}
            
            {isAuthenticated && userRole === "admin" && (
              <TabsTrigger
                value="admin"
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-xs sm:text-sm px-2 py-2"
              >
                <User className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-sm">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Live Safety Map
                  </h2>
                  <div className="h-[400px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden">
                    <SafetyMap incidents={incidents} />
                  </div>
                </CardContent>
              </Card>

              <div>
                <AlertsPanel />
              </div>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <div className="max-w-2xl mx-auto">
              <IncidentReportForm
                onSubmit={handleIncidentSubmit}
                isLoggedIn={isAuthenticated}
                onLoginClick={handleLoginClick}
              />
            </div>
          </TabsContent>

          {/* Chatbot Tab */}
          <TabsContent value="chatbot">
            <div className="max-w-4xl mx-auto">
              <SafetyChatbot />
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <EmergencyLocator />
          </TabsContent>

          {/* Analytics Tab (Admin Only) */}
          {isAuthenticated && userRole === "admin" && (
            <TabsContent value="analytics">
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Analytics Dashboard
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Monitor incidents, trends, and risk zones
                  </p>
                </div>
                <AnalyticsDashboard role={userRole} />
              </div>
            </TabsContent>
          )}

          {/* Admin Panel Tab (Admin Only) */}
          {isAuthenticated && userRole === "admin" && (
            <TabsContent value="admin">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      User Management
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base">
                            Active Users
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            2,847 registered users
                          </p>
                        </div>
                        <Button size="sm" className="self-start sm:self-auto">Manage</Button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base">
                            Pending Reports
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            23 reports awaiting review
                          </p>
                        </div>
                        <Button size="sm" className="self-start sm:self-auto">Review</Button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base">
                            System Status
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            All systems operational
                          </p>
                        </div>
                        <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm self-start sm:self-auto">
                          Healthy
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      Data Control
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
                      >
                        Export Incident Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
                      >
                        Generate Reports
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
                      >
                        Configure Alerts
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
                      >
                        User Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center md:text-left">
              © 2025 SSAN - Smart Safety Awareness Network. All
              rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <button className="hover:text-gray-900">
                Privacy Policy
              </button>
              <button className="hover:text-gray-900">
                Terms of Service
              </button>
              <button className="hover:text-gray-900">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}