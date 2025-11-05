"use client";
import React, { FC, useEffect, useState } from "react";

interface CloudinaryPlayerProps {
  title?: string;
  publicId: string;
}

const CloudinaryPlayer: FC<CloudinaryPlayerProps> = ({ title = "Video Player", publicId }) => {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const res = await fetch(`/api/getSignedUrl?publicId=${publicId}`);
        const data = await res.json();
        setSignedUrl(data.signedUrl);
      } catch (error) {
        console.error("Failed to fetch signed URL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [publicId]);

  if (loading) return <p>Loading video...</p>;
  if (!signedUrl) return <p>Failed to load video</p>;

  return (
    <div className="w-full max-w-4xl mx-auto ">
      <video
        src={signedUrl}
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        className="w-full rounded-xl shadow-lg"
      />
    </div>
  );
};

export default CloudinaryPlayer;
