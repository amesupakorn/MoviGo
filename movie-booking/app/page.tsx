"use client";
import { useEffect, useState } from "react";
import LoadTwo from "@/app/components/ui/loading/loadTwo"

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        setTimeout(() => {
            setLoading(false); 
        }, 2000);
    }, []);


    return (
      <div>
          {loading && <LoadTwo />}
          <div className="bg-zinc-900 p-8 text-white"> {/* Page content */}
              <h1 className="text-2xl">Welcome to My Page</h1>
              <p>This is some content...</p>
          </div>
      </div>
  );
};
