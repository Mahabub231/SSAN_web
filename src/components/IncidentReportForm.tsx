import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, MapPin, Lock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface IncidentReportFormProps {
  onSubmit: (incident: any) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function IncidentReportForm({ onSubmit, isLoggedIn, onLoginClick }: IncidentReportFormProps) {
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }
    
    const incident = {
      type,
      severity,
      description,
      location,
      photo: photo?.name || null,
      timestamp: new Date().toISOString(),
      lat: 23.8103 + (Math.random() - 0.5) * 0.1,
      lng: 90.4125 + (Math.random() - 0.5) * 0.1,
    };

    onSubmit(incident);
    
    // Reset form
    setType('');
    setSeverity('');
    setDescription('');
    setLocation('');
    setPhoto(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Report an Incident</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Help keep your community safe by reporting incidents</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        {!isLoggedIn && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              You must be logged in to submit incident reports.{' '}
              <button onClick={onLoginClick} className="font-semibold text-blue-600 hover:underline">
                Login here
              </button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="type" className="text-xs sm:text-sm">Incident Type</Label>
            <Select value={type} onValueChange={setType} required disabled={!isLoggedIn}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime">Crime</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                <SelectItem value="hazard">Hazard</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="severity" className="text-xs sm:text-sm">Severity Level</Label>
            <Select value={severity} onValueChange={setSeverity} required disabled={!isLoggedIn}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter location or use GPS"
                className="text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                disabled={!isLoggedIn}
              />
              <Button type="button" variant="outline" size="icon" className="flex-shrink-0" disabled={!isLoggedIn}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the incident..."
              className="text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={!isLoggedIn}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="photo" className="text-xs sm:text-sm">Photo (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={!isLoggedIn}
              />
              <label
                htmlFor="photo"
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-input rounded-md transition-colors text-xs sm:text-sm ${
                  isLoggedIn ? 'cursor-pointer hover:bg-accent' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate max-w-[200px]">{photo ? photo.name : 'Upload Photo'}</span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full h-9 sm:h-10 text-sm" disabled={!isLoggedIn}>
            {isLoggedIn ? 'Submit Report' : 'Login to Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}