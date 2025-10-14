'use client';

import { useState } from 'react';

export default function ImagesUploader({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    setUrls(uploaded);
    onUpload(uploaded);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-[Bungee] text-[#E9C87D]">Zdjęcia</label>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="p-2 bg-[#131313] text-[#d9d9d9] border border-[#E9C87D]/30 rounded-lg"
      />
      {uploading && <p className="text-sm text-[#E9C87D]">Wgrywanie...</p>}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {urls.map((url) => (
            <img
              key={url}
              src={url}
              alt="uploaded"
              className="rounded-xl object-cover w-full h-24"
            />
          ))}
        </div>
      )}
    </div>
  );
}
