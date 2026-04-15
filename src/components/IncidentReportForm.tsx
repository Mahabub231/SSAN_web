import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Camera, MapPin, Lock } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

interface IncidentReportFormProps {
  onSubmit: (incident: any) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function IncidentReportForm({
  onSubmit,
  isLoggedIn,
  onLoginClick,
}: IncidentReportFormProps) {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !auth.currentUser) {
      onLoginClick();
      return;
    }

    if (!type || !severity || !description || !location) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const user = auth.currentUser;

    const incident = {
      type,
      severity,
      description,
      location,
      photo: photo?.name || null,
      timestamp: serverTimestamp(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userEmail: user.email,

      // temporary coordinates
      lat: 23.8103 + (Math.random() - 0.5) * 0.1,
      lng: 90.4125 + (Math.random() - 0.5) * 0.1,
    };

    try {
      await addDoc(collection(db, "incidents"), incident);

      onSubmit(incident);

      setType("");
      setSeverity("");
      setDescription("");
      setLocation("");
      setPhoto(null);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Report an Incident</CardTitle>
        <CardDescription>
          Help keep your community safe by reporting incidents
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isLoggedIn && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to submit reports.{" "}
              <button
                onClick={onLoginClick}
                className="text-blue-600 font-semibold"
              >
                Login here
              </button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TYPE */}
          <div>
            <Label>Incident Type</Label>
            <Select value={type} onValueChange={setType} disabled={!isLoggedIn}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime">Crime</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
                <SelectItem value="hazard">Hazard</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SEVERITY */}
          <div>
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity} disabled={!isLoggedIn}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LOCATION */}
          <div>
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              disabled={!isLoggedIn}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident"
              rows={4}
              disabled={!isLoggedIn}
            />
          </div>

          {/* PHOTO */}
          <div>
            <Label>Photo (optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={!isLoggedIn}
            />
          </div>

          {/* SUBMIT */}
          <Button type="submit" disabled={!isLoggedIn || loading}>
            {loading ? "Submitting..." : isLoggedIn ? "Submit Report" : "Login required"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}