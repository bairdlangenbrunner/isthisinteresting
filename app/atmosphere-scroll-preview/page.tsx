import AtmosphereScrolly from "@/app/(posts)/_006-atmosphere-scroll/atmosphere-scrolly-prototype.jsx";

export default function AtmosphereScrollPreviewPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "#000",
      }}
    >
      <AtmosphereScrolly />
    </div>
  );
}
