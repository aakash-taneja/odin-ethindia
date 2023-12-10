"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { SafeAuthPack, AuthKitSignInData } from "@safe-global/auth-kit";
import DashBoard from "./dashboard/page";

const LoginPage: React.FC = () => {
  const [safeAuthPack, setSafeAuthPack] = useState<any>(null);
  const [authData, setAuthData] = useState<AuthKitSignInData | null>(null);

  useEffect(() => {
    // Initialize SafeAuthPack on component mount
    const initializeSafeAuth = async () => {
      try {
        // Create SafeAuthPack instance
        const safeAuthPackInstance = new SafeAuthPack();
        const chainConfig = {
          chainId: "0x13881", // Change this to the desired chainId
          rpcTarget: "https://polygon-mumbai-bor.publicnode.com", // Change this to the RPC endpoint of the desired network
        };
        await safeAuthPackInstance.init({ enableLogging: true, chainConfig });

        // Set the SafeAuthPack instance in the state
        setSafeAuthPack(safeAuthPackInstance);
      } catch (error) {
        console.error("Error initializing SafeAuthPack:", error);
      }
    };

    initializeSafeAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      if (safeAuthPack) {
        // Call signIn method to initiate the authentication process
        const authData = await safeAuthPack.signIn();
        setAuthData(authData);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      if (safeAuthPack) {
        // Call signOut method to end the current session
        await safeAuthPack.signOut();
        setAuthData(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log(authData);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      {authData ? (
        <>
          <DashBoard authData={authData} safeAuthPack={safeAuthPack} />
          <button
            style={{ padding: "10px", borderRadius: "10px" }}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "20px" }}>Login Page</h1>
          <button onClick={handleSignIn}>Sign In</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
