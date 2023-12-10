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
export const saveToDb = async (data: any) => {
  console.log("calling savetoDB");
  const response = await fetch(`${config.metaServer}/save`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log("response from uploadtobackend", await response.text());
  return await response.text();
};
export const search = async (data: any) => {
  console.log("calling search");
  const response = await fetch(`${config.metaServer}/search`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("response from searchapi", await response.text());
  return await response.json();
};
