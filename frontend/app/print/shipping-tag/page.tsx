"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function TagPanel({ data }: {
  data: {
    client: string; city: string; venue: string; expo_name: string;
    expo_management: string; booth_no: string;
    today: string; deadline: string;
  }
}) {
  return (
    <div style={{
      border: "1.5px solid black",
      width: "280px",
      fontFamily: "Arial, sans-serif",
      fontSize: "8pt",
      color: "black",
      overflow: "hidden",
    }}>
      {/* Freeman logo */}
      <div style={{ padding: "8px 10px 4px", display: "flex", alignItems: "baseline", gap: "1px" }}>
        <span style={{ fontWeight: "bold", fontSize: "17pt", color: "#1A3A6B", letterSpacing: "-0.5px" }}>
          Freeman
        </span>
        <span style={{ fontWeight: "bold", fontSize: "10pt", color: "#00AEEF", marginBottom: "4px" }}>.</span>
      </div>

      {/* RUSH banner */}
      <div style={{
        background: "black", color: "white",
        textAlign: "center", fontWeight: "bold",
        fontSize: "22pt", letterSpacing: "6px",
        padding: "2px 0",
      }}>
        RUSH
      </div>

      {/* DO NOT DELAY */}
      <div style={{
        textAlign: "center", fontWeight: "bold",
        fontSize: "12pt", letterSpacing: "4px",
        padding: "4px 0 2px",
      }}>
        DO NOT DELAY
      </div>

      {/* Blue line */}
      <div style={{ height: "2px", background: "#00AEEF", margin: "4px 0" }} />

      {/* Dates */}
      <div style={{ padding: "2px 10px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
          RECEIVING DATE BEGINS: {data.today}
        </div>
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
          DEADLINE DATE IS: {data.deadline}
        </div>
      </div>

      {/* TO field */}
      <div style={{ padding: "0 10px 4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6px" }}>
          <span style={{ fontWeight: "bold" }}>TO:</span>
          <span style={{ flex: 1, borderBottom: "0.5px solid black" }} />
        </div>
        <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "6px", fontSize: "9pt" }}>
          {data.expo_name}
        </div>
        <div style={{ paddingLeft: "12px", lineHeight: "1.6" }}>
          <div>C/O {data.expo_management}</div>
          <div>{data.venue}</div>
          <div>{data.city}</div>
        </div>
      </div>

      {/* Blue line */}
      <div style={{ height: "2px", background: "#00AEEF", margin: "6px 0" }} />

      {/* Advance Warehouse Shipping Labels */}
      <div style={{
        textAlign: "center", fontWeight: "bold",
        fontSize: "9pt", color: "#00AEEF",
        padding: "0 8px 6px",
      }}>
        Advance Warehouse Shipping Labels
      </div>

      {/* EVENT */}
      <div style={{ padding: "0 10px 4px", display: "flex", gap: "4px" }}>
        <span style={{ fontWeight: "bold" }}>EVENT:</span>
        <span>{data.expo_name}</span>
      </div>

      {/* BOOTH NUMBER */}
      <div style={{ padding: "0 10px 4px", display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>BOOTH NUMBER:</span>
        <span style={{ flex: 1, borderBottom: "0.5px solid black", paddingLeft: "2px" }}>
          {data.booth_no}
        </span>
      </div>

      {/* NUMBER OF PIECES */}
      <div style={{ padding: "4px 10px 10px", display: "flex", alignItems: "baseline", gap: "4px", fontWeight: "bold" }}>
        <span>NUMBER</span>
        <span style={{ display: "inline-block", width: "40px", borderBottom: "0.5px solid black" }} />
        <span>OF</span>
        <span style={{ display: "inline-block", width: "40px", borderBottom: "0.5px solid black" }} />
        <span>PIECES</span>
      </div>
    </div>
  );
}

function ShippingTagContent() {
  const params = useSearchParams();
  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(today.getDate() + 5);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const data = {
    client: params.get("client") ?? "",
    city: params.get("city") ?? "",
    venue: params.get("venue") ?? "",
    expo_name: params.get("expo_name") ?? "",
    expo_management: params.get("expo_management") ?? "",
    booth_no: params.get("booth_no") ?? "",
    today: fmt(today),
    deadline: fmt(deadline),
  };

  useEffect(() => {
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "12px", background: "white", minHeight: "100vh" }}>

      {/* Print button */}
      <div className="no-print" style={{ marginBottom: "12px" }}>
        <button
          onClick={() => window.print()}
          style={{ padding: "6px 18px", background: "#4f46e5", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
        >
          Yazdır / PDF olarak kaydet
        </button>
      </div>

      {/* Two panels side by side */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <TagPanel data={data} />
        <TagPanel data={data} />
      </div>

      <style>{`
        @media print {
          @page { margin: 0.5cm; size: letter landscape; }
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ShippingTagPage() {
  return (
    <Suspense>
      <ShippingTagContent />
    </Suspense>
  );
}
