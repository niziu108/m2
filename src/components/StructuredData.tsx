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
          // ważne: czysty JSON bez formatowania.
          // Znak „<” idzie jako kod unicode: tekst z panelu (np. tytuł z „</script>”) nie może zamknąć
          // tego znacznika, a po odczytaniu JSON-a to dalej ten sam znak.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
};

export default StructuredData;
