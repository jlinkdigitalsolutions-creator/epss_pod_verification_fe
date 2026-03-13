import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CheckCircle2 } from "lucide-react"; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as jose from 'jose';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VoucherHeader } from './VoucherHeader';
import { VoucherTable } from './VoucherTable';
import { SignModal } from './SignModal';
import { TopNav } from '@/components/layout/TopNav';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { PageHeader } from '@/components/layout/PageHeader';
import { getRegionInfo } from '@/constants/regions';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function VoucherPage({
  invoice,
  deliverer,
  onBack,
  saveSignedVoucher,
  onLogout,
}) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userinfo')));
  console.log(userInfo);
  const location = useLocation();

  const formatName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    
    // If there's only one name, return it; otherwise, format it
    if (parts.length < 2) return fullName;
    
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0);
    
    return `${firstName} ${lastInitial}.`;
  };

  const decodeUserInfoResponse = async (userinfoJwtToken) => {
    try {
      return jose.decodeJwt(userinfoJwtToken);
    } catch (error) {
      console.error('Error decoding JWT user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchToken = async (code) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/token', {
            code:code
          }
        );

        const { access_token } = response.data;
        console.log("Access token:", access_token);

        const userInfoResponse = await axios.post("http://localhost:5000/api/userinfo/", {
          access_token: access_token
        });

        console.log("User info response:", userInfoResponse.data);
        const decodedUserInfo = await decodeUserInfoResponse(userInfoResponse.data);
        decodedUserInfo.formattedName = formatName(decodedUserInfo.name);
        console.log("Decoded user info:", decodedUserInfo);

        // Store the decoded user info in state
        setUserInfo(decodedUserInfo);
        localStorage.setItem('userinfo', JSON.stringify(decodedUserInfo));

      } catch (error) {
        console.error('Error fetching token or user info:', error);
      }
    };

    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      fetchToken(code);
    }

  }, [location.search]);

  // Get the 'code' value from the URL
  const verified = userInfo !== null;

  const generateSignInUrl = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_APP_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_APP_REDIRECT_URI,
      response_type: "code",
      scope: "openid profile email",
      acr_values: "mosip:idp:acr:generated-code mosip:idp:acr:linked-wallet mosip:idp:acr:biometrics",
      claims: '{"userinfo":{"name":{"essential":true},"phone":{"essential":true},"email":{"essential":true},"picture":{"essential":true},"gender":{"essential":true},"birthdate":{"essential":true},"address":{"essential":true}},"id_token":{}}',
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
      display: "page",
      nonce: "g4DEuje5Fx57Vb64dO4oqLHXGT8L8G7g",
      state: "ptOO76SD",
      ui_locales: "en",
    });

    return `${import.meta.env.VITE_APP_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
  };

  const savedData = localStorage.getItem('selectedInvoice');

  // 2. Convert it back to an object (if it exists)
  invoice = savedData ? JSON.parse(savedData) : null;
  
  const [signOpen, setSignOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const regionInfo = invoice ? getRegionInfo(invoice.regionCode) : null;

  const handleFinalize = async (finalizedVoucher) => {
    await saveSignedVoucher(finalizedVoucher);
    setSignOpen(false);
    // Defer opening success dialog so sign modal can close first
    requestAnimationFrame(() => {
      setSuccessOpen(true);
    });
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onBack();
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <AnimatedBackground />
      <TopNav
        user={deliverer}
        onLogout={onLogout}
        title={invoice?.invoiceNo ?? 'Voucher'}
      />

      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8" role="main">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-end justify-between gap-4 mb-2">
            
            <PageHeader
              title="Receiving voucher"
              description={`${invoice?.invoiceNo} · Review items and sign to save`}
            />
            <Button
              variant="ghost"
              onClick={() => navigate("/invoice")}
              className="-ml-2 mb-2 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 group"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/80">
            <div className="p-6 md:p-8">
              <VoucherHeader invoice={invoice} regionInfo={regionInfo} userInfo={userInfo} />
              <VoucherTable items={invoice.items} />

              <div className="mt-8 pt-6 border-t border-border">
                {verified ? (
                /* VERIFIED STATE: Show a success badge or a disabled "Connected" button */
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    Fyda Connected
                  </div>
                  <p className="text-xs text-gray-500 text-center">Identity verified successfully</p>
                </div>
              ) : (

                /* UNVERIFIED STATE: Show the clickable Connect button */
                /* Updated link to use the dynamically generated URL */
                <a href={generateSignInUrl()} className="block w-full">
                  <Button
                    className="w-full h-12 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    size="lg"
                    style={{ backgroundColor: "#2c566a" }}
                  >
                    Connect Fyda
                  </Button>
                </a>
              )}
              </div>

              <div className="pt-6 border-border">
                <Button
                  className="w-full h-12 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  size="lg"
                  onClick={() => setSignOpen(true)}
                  disabled={!verified}
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SignModal
        open={signOpen}
        onOpenChange={setSignOpen}
        invoice={invoice}
        deliverer={deliverer}
        onFinalize={handleFinalize}
        userInfo={userInfo}
      />

      <Dialog open={successOpen} onOpenChange={(open) => { setSuccessOpen(open); if (!open) onBack(); }}>
        <DialogContent className="max-w-sm rounded-2xl border border-border bg-card shadow-xl text-center sm:text-left">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 sm:mx-0">
              <CheckCircle className="h-7 w-7" />
            </div>
            <DialogTitle className="text-lg pt-3">Voucher saved</DialogTitle>
            <DialogDescription>
              Saved locally. It will sync when you're back online.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            <Button onClick={handleSuccessClose} className="w-full sm:w-auto">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
