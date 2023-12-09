import { config } from "@/config";

export const uploadToBackend = async (data: any) => {
  console.log("calling uploadtobackend");
  const response = await fetch(`${config.metaServer}/ipfs`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log("response from uploadtobackend", await response.text());
  return await response.text();
};
