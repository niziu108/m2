// src/components/StructuredData.tsx
import React from "react";

type JSONLD = Record<string, any> | Record<string, any>[];

const StructuredData = ({ jsonLd }: { jsonLd: JSONLD }) => {
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // ważne: czysty JSON bez formatowania
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
