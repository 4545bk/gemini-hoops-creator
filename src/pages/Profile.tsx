import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, Wallet, Clock, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
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
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/receipts/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

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
    <div className="min-h-screen bg-[#212121]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white" style={{ fontFamily: 'Extenda Trial 30 Deca, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Profile
            </h1>
            <p className="text-xl text-gray-400" style={{ fontFamily: 'monument_extendedregular, sans-serif' }}>
              Manage your account and credits
            </p>
          </div>

          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-[#f1e728] to-[#e5db20] border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#212121] text-lg mb-2 font-semibold">Your Balance</p>
                  <p className="text-[#212121] opacity-80 text-sm">Each generation costs $1</p>
                </div>
                <Wallet className="h-12 w-12 text-[#212121] opacity-50" />
              </div>
              <div className="mt-6">
                <div className="text-6xl md:text-7xl font-bold text-[#212121]">
                  ${credits}
                </div>
                <p className="text-[#212121] opacity-80 mt-2">Available Balance</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Funds Card */}
            <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
              <CardHeader className="border-b border-[#333]">
                <CardTitle className="text-2xl text-white">Add Funds</CardTitle>
                <p className="text-gray-400 text-sm mt-2">Pay 25 Birr to receive $100 (100 generations)</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#444]">
                  <p className="font-semibold mb-4 text-[#f1e728] text-lg">Payment Instructions:</p>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-[#f1e728] font-bold">1.</span>
                      <span>Send 25 Birr to CBE: <strong className="text-white">100009552240</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#f1e728] font-bold">2.</span>
                      <span>Or Telebirr: <strong className="text-white">0946349963</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#f1e728] font-bold">3.</span>
                      <span>Upload your receipt below</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#f1e728] font-bold">4.</span>
                      <span>Wait for approval (you'll be notified)</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <Label htmlFor="receipt" className="text-white text-base mb-3 block">Upload Receipt</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="cursor-pointer bg-[#2a2a2a] border-[#444] text-white file:bg-[#f1e728] file:text-[#212121] file:border-0 file:font-bold file:px-4 file:py-2 file:rounded-md hover:file:bg-[#e5db20]"
                  />
                </div>

                <Button
                  onClick={handleReceiptUpload}
                  disabled={uploading || !receiptFile}
                  className="w-full h-12 bg-[#f1e728] hover:bg-[#e5db20] text-[#212121] font-bold"
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

            {/* Payment History Card */}
            <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
              <CardHeader className="border-b border-[#333]">
                <CardTitle className="text-2xl text-white">Payment History</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {payments.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#2a2a2a] border border-[#444] hover:border-[#f1e728] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {payment.status === 'approved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : payment.status === 'declined' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium text-white">{payment.amount} Birr</p>
                            <p className="text-sm text-gray-400">
                              {new Date(payment.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          payment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          payment.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {payment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No payment history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation History */}
          {generations.length > 0 && (
            <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
              <CardHeader className="border-b border-[#333]">
                <CardTitle className="text-2xl text-white">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generations.map((gen) => (
                    gen.image_url && (
                      <div key={gen.id} className="rounded-lg overflow-hidden border-2 border-[#444] hover:border-[#f1e728] transition-all shadow-lg hover:shadow-2xl group">
                        <img src={gen.image_url} alt={gen.category} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                        <div className="p-3 bg-[#2a2a2a]">
                          <p className="text-sm text-gray-300 truncate capitalize">{gen.category.replace('_', ' ')}</p>
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
