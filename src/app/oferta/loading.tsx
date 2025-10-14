export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9997] grid place-items-center bg-[#131313]">
      <div
        aria-hidden
        className="m2-breathe"
        style={{
          width: 220,
          height: 220,
          backgroundColor: "#E9C87D",
          WebkitMask: 'url("/logo.webp") center / contain no-repeat',
          mask: 'url("/logo.webp") center / contain no-repeat',
        }}
      />
      {/* Zwykły <style>, nie styled-jsx */}
      <style>{`
        @keyframes m2-breathe { 
          0% { transform: scale(1) } 
          50% { transform: scale(1.08) } 
          100% { transform: scale(1) } 
        }
        .m2-breathe {
          animation: m2-breathe 1.6s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
