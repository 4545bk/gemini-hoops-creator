import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, Sparkles, Download } from "lucide-react";
import Navigation from "@/components/Navigation";

const categories = [
  { value: "nba_player", label: "NBA Player" },
  { value: "baseball_player", label: "Baseball Player" },
  { value: "footballer", label: "Footballer" },
  { value: "meme", label: "Meme" },
  { value: "wedding", label: "Wedding" },
  { value: "boyfriend", label: "Add Boyfriend" },
  { value: "girlfriend", label: "Add Girlfriend" },
  { value: "sketch", label: "Sketch" },
  { value: "paint", label: "Painting" },
  { value: "graduation", label: "Graduation" },
  { value: "famous_location", label: "Famous Location" },
  { value: "with_celebrity", label: "With Celebrity" },
  { value: "enhance_photo", label: "Enhance a Photo" },
  { value: "professional_photo", label: "Make it Professional Photo" },
  { value: "custom", label: "Custom Prompt" },
];

const Generator = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [category, setCategory] = useState("nba_player");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchCredits(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchCredits(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setCredits(Math.floor(data.balance / 100)); // Convert to display credits
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    if (credits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "Please purchase more credits to continue",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    setLoading(true);

    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Generate image via edge function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          imageUrl: publicUrl,
          category,
          customPrompt: category === 'custom' ? customPrompt : '',
        }
      });

      if (error) throw error;

      setGeneratedImage(data.imageUrl);
      await fetchCredits(user.id);

      toast({
        title: "Success!",
        description: "Your image has been generated",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
            <p className="text-muted-foreground">
              You have <span className="text-primary font-bold">${credits}</span> remaining
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Create Your Transformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="mt-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                  {previewUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {category === 'custom' && (
                  <div>
                    <Label htmlFor="prompt">Custom Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe what you want..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedFile}
                  className="w-full gradient-hero text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate ($1)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Generated Result</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border shadow-glow">
                      <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                    </div>
                    <Button
                      onClick={handleDownload}
                      className="w-full gradient-accent text-white"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Image
                    </Button>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Your generated image will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
