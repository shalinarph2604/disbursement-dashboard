import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/transactions");

        console.log("Status:", res.status);
        console.log("Data:", res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to Next.js!</h1>
    </div>
  );
}
