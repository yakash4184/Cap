import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useCivicData } from "@/contexts/CivicDataContext";
import { categoryIcons, categoryLabels } from "@/lib/civic-data";
import { LOCATION_OPTIONS, type IssueCategory, type LocationName } from "@/types/civic";

export default function ReportIssue() {
  const { currentUser } = useAuth();
  const { submitIssue } = useCivicData();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("pothole");
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState<LocationName>(currentUser?.location || "Mirzapur");
  const [lat, setLat] = useState(25.1461);
  const [lng, setLng] = useState(82.5697);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Report a civic issue</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo, confirm the GPS or address, and we will route it to the right department automatically.
          </p>

          <Card className="mt-8 p-6 shadow-card">
            <div className="space-y-5">
              <div>
                <Label>Issue photo</Label>
                <label className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/40 text-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Issue preview" className="h-full w-full rounded-3xl object-cover" />
                  ) : (
                    <>
                      <Camera className="mb-3 h-8 w-8 text-primary" />
                      <p className="font-medium">Upload image evidence</p>
                      <p className="text-sm text-muted-foreground">PNG or JPG from camera/gallery</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              <div>
                <Label htmlFor="title">Short title</Label>
                <Input id="title" className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as IssueCategory)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {categoryIcons[value as IssueCategory]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  className="mt-2"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Location</Label>
                  <Select value={locationName} onValueChange={(value) => setLocationName(value as LocationName)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_OPTIONS.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="address">Address / landmark</Label>
                  <Input id="address" className="mt-2" value={address} onChange={(event) => setAddress(event.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" className="mt-2" value={lat} onChange={(event) => setLat(Number(event.target.value) || 0)} />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" className="mt-2" value={lng} onChange={(event) => setLng(Number(event.target.value) || 0)} />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        return;
                      }
                      navigator.geolocation.getCurrentPosition((position) => {
                        setLat(Number(position.coords.latitude.toFixed(6)));
                        setLng(Number(position.coords.longitude.toFixed(6)));
                      });
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    Use GPS
                  </Button>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => {
                  submitIssue({
                    title,
                    description,
                    category,
                    address,
                    locationName,
                    lat,
                    lng,
                    imageUrl,
                  });
                  navigate("/dashboard", { replace: true });
                }}
              >
                <Send className="h-4 w-4" />
                Submit issue
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
