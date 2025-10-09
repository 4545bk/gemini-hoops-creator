import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, CreditCard, Image as ImageIcon } from "lucide-react";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [generations, setGenerations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
      fetchProfile(session.user.id);
      fetchCredits(session.user.id);
      fetchGenerations(session.user.id);
      fetchPayments(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchCredits(session.user.id);
        fetchGenerations(session.user.id);
        fetchPayments(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) setProfile(data);
  };

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

  const fetchGenerations = async (userId: string) => {
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (data) setGenerations(data);
  };

  const fetchPayments = async (userId: string) => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) setPayments(data);
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile || !user) {
      toast({
        title: "Error",
        description: "Please select a receipt image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload receipt to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/receipts/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Submit payment via edge function
      const { error } = await supabase.functions.invoke('submit-payment', {
        body: {
          receiptUrl: publicUrl,
          amount: 25,
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Submitted",
        description: "Your payment is being reviewed. You'll be notified once approved.",
      });

      setReceiptFile(null);
      fetchPayments(user.id);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and credits</p>
          </div>

          {/* Credits Card */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Your Credits</CardTitle>
              <CardDescription>Each generation costs 1 credit (100 points)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold gradient-hero bg-clip-text text-transparent mb-2">
                  {credits}
                </div>
                <p className="text-muted-foreground">Credits Available</p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Credits Card */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>
                Pay 25 Birr to receive 100 credits (100 generations)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-semibold mb-2">Payment Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Send 25 Birr to CBE: <strong>100009552240</strong></li>
                  <li>Or Telebirr: <strong>0946349963</strong></li>
                  <li>Upload your receipt below</li>
                  <li>Wait for approval (you'll be notified)</li>
                </ol>
              </div>

              <div>
                <Label htmlFor="receipt">Upload Receipt</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="mt-2 cursor-pointer"
                />
              </div>

              <Button
                onClick={handleReceiptUpload}
                disabled={uploading || !receiptFile}
                className="w-full gradient-accent text-white"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit Payment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payment History */}
          {payments.length > 0 && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{payment.amount} Birr</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'declined' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation History */}
          {generations.length > 0 && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generations.map((gen) => (
                    gen.image_url && (
                      <div key={gen.id} className="rounded-lg overflow-hidden border shadow-sm hover:shadow-glow transition-shadow">
                        <img src={gen.image_url} alt={gen.category} className="w-full h-48 object-cover" />
                        <div className="p-2 bg-muted">
                          <p className="text-xs text-muted-foreground truncate">{gen.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
