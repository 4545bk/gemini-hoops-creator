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
import { Loader2, Upload, Sparkles, Download, Zap } from "lucide-react";
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
      setCredits(Math.floor(data.balance / 100));
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
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

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
    <div className="min-h-screen bg-[#212121]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white" style={{ fontFamily: 'Extenda Trial 30 Deca, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Image Generator
            </h1>
            <p className="text-xl text-gray-400" style={{ fontFamily: 'monument_extendedregular, sans-serif' }}>
              Transform your photos with cutting-edge AI technology
            </p>
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-[#f1e728] rounded-full">
              <Zap className="h-5 w-5 text-[#212121]" />
              <span className="text-[#212121] font-bold text-lg">${credits} Credits Available</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
              <CardHeader className="border-b border-[#333]">
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Upload className="h-6 w-6 text-[#f1e728]" />
                  Upload & Configure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <Label htmlFor="image" className="text-white text-base mb-3 block">Upload Your Image</Label>
                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="cursor-pointer bg-[#2a2a2a] border-[#444] text-white file:bg-[#f1e728] file:text-[#212121] file:border-0 file:font-bold file:px-4 file:py-2 file:rounded-md hover:file:bg-[#e5db20]"
                    />
                  </div>
                  {previewUrl && (
                    <div className="mt-6 rounded-xl overflow-hidden border-2 border-[#f1e728] shadow-lg">
                      <img src={previewUrl} alt="Preview" className="w-full h-80 object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="text-white text-base mb-3 block">Select Transformation</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-[#2a2a2a] border-[#444] text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#444]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-[#2a2a2a]">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {category === 'custom' && (
                  <div>
                    <Label htmlFor="prompt" className="text-white text-base mb-3 block">Custom Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe your transformation in detail..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="bg-[#2a2a2a] border-[#444] text-white resize-none"
                    />
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedFile}
                  className="w-full h-14 bg-[#f1e728] hover:bg-[#e5db20] text-[#212121] font-bold text-lg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-6 w-6" />
                      Generate ($1)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
              <CardHeader className="border-b border-[#333]">
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[#f1e728]" />
                  Generated Result
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {generatedImage ? (
                  <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden border-2 border-[#f1e728] shadow-2xl relative">
                      <div className="absolute top-4 right-4 bg-[#f1e728] text-[#212121] px-3 py-1 rounded-full text-sm font-bold">
                        ✨ AI Generated
                      </div>
                      <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                    </div>
                    <Button
                      onClick={handleDownload}
                      className="w-full h-14 bg-[#f1e728] hover:bg-[#e5db20] text-[#212121] font-bold text-lg"
                      size="lg"
                    >
                      <Download className="mr-2 h-6 w-6" />
                      Download Image
                    </Button>
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center border-2 border-dashed border-[#444] rounded-xl bg-[#0f0f0f]">
                    <div className="text-center text-gray-500">
                      <Sparkles className="h-20 w-20 mx-auto mb-6 opacity-30" />
                      <p className="text-lg mb-2">Your AI-generated image will appear here</p>
                      <p className="text-sm">Upload an image and click Generate to start</p>
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
