"use client";
import { deploytoLightHouse } from "@/lightHouseStorage";
import { uploadToBackend } from "@/services/metaServices";
import { ethers } from "ethers";
import React, { useState } from "react";
import abi from "@/abi.json";

interface FormData {
  file: File | null;
  title: string;
  description: string;
}

const DashBoard: React.FC<{ authData: any; safeAuthPack: any }> = ({
  authData,
  safeAuthPack,
}) => {
  const [formData, setFormData] = useState<FormData>({
    file: null,
    title: "",
    description: "",
  });

  const [imageEvent, setImageEvent] = useState<any>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageEvent(event);
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setFormData((prevData) => ({ ...prevData, file }));
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setFormData((prevData) => ({ ...prevData, title }));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const description = event.target.value;
    setFormData((prevData) => ({ ...prevData, description }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const cid = await deploytoLightHouse(
      imageEvent.target.files,
      (progressData: any) => {
        let percentageDone: any =
          100 -
          Number((progressData?.total / progressData?.uploaded)?.toFixed(2));
        console.log("percentage done: ", percentageDone);
        // setIpfsLoading(percentageDone);
      }
    );

    let fileDetails = {
      fCid: cid,
      name: formData.title,
      fType: "image",
      description: formData.description,
      timestamp: new Date().getTime(),
    };
    console.log("filedetails", fileDetails);
    const mcid = await uploadToBackend(fileDetails);
    console.log("calling contract ...");
    //CALL CONTRACT HERE
    if (authData && authData.eoa) {
      try {
        console.log("inside try ...");
        // Get the signer using SafeAuthPack
        const provider = new ethers.BrowserProvider(
          safeAuthPack?.getProvider()
        );
        const signer = await provider.getSigner();
        console.log("signer", signer);
        // Create the contract instance
        const contractAddress = "0xaFc9dE72D13eE5dBCb586420Aa8014f7eDE99886";
        const contractABI = abi;
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Call the safeMint function
        const uri = `https://ipfs.io/ipfs/${mcid}`; // Replace with your URI
        const tx = await contract.safeMint(authData.eoa, uri);
        console.log("call done ...");

        // Wait for the transaction to be mined
        await tx.wait();

        console.log("Transaction successful:", tx);
      } catch (error) {
        console.error("Error calling contract:", error);
      }
    }

    // Reset the form after submission
    setFormData({
      file: null,
      title: "",
      description: "",
    });
  };

  return (
    <div>
      <div>
        <h2>Welcome to Your Dashboard</h2>
        <p>Ethereum Address: {authData.eoa}</p>
        {authData.safes && (
          <p>Associated Safe addresses: {authData.safes.join(", ")}</p>
        )}
        {/* Add more dashboard content based on your application's requirements */}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload File:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default DashBoard;
