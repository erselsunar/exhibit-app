"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const thin = "0.5px solid black";
const thick = "1px solid black";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "black", color: "white", fontWeight: "bold",
      fontSize: "7pt", textAlign: "center", padding: "2px 4px",
    }}>
      {children}
    </div>
  );
}

function FieldRow({ label, value = "" }: { label: string; value?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", marginBottom: "3px", minHeight: "14px" }}>
      {label && (
        <span style={{ fontWeight: "bold", fontSize: "7pt", whiteSpace: "nowrap", marginRight: "3px" }}>
          {label}
        </span>
      )}
      <span style={{ flex: 1, borderBottom: thin, fontSize: "8.5pt", paddingLeft: "2px" }}>
        {value}
      </span>
    </div>
  );
}

function Checkbox({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "3px", fontSize: "7pt" }}>
      <span style={{ display: "inline-block", width: "9px", height: "9px", border: thin, flexShrink: 0 }} />
      {label}
    </div>
  );
}

function BOLContent() {
  const params = useSearchParams();
  const client = params.get("client") ?? "";
  const city = params.get("city") ?? "";
  const venue = params.get("venue") ?? "";
  const expo_management = params.get("expo_management") ?? "";
  const booth_no = params.get("booth_no") ?? "";
  const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });

  useEffect(() => {
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "8pt", color: "black", padding: "8px", background: "white", minHeight: "100vh" }}>

      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ marginBottom: "8px" }}>
        <button
          onClick={() => window.print()}
          style={{ padding: "6px 18px", background: "#4f46e5", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
        >
          Yazdır / PDF olarak kaydet
        </button>
      </div>

      <div style={{ border: thick, maxWidth: "760px" }}>

        {/* ── TITLE ── */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: thick, padding: "4px 8px" }}>
          <div style={{ flex: 1, fontSize: "7pt" }}>Date: {today}</div>
          <div style={{ flex: 2, textAlign: "center", fontWeight: "bold", fontSize: "17pt", letterSpacing: "1px" }}>
            BILL OF LADING
          </div>
          <div style={{ flex: 1, textAlign: "right", fontSize: "7pt" }}>Page 1 of ______</div>
        </div>

        {/* ── SHIP FROM | BOL NUMBER ── */}
        <div style={{ display: "flex", borderBottom: thin }}>
          <div style={{ flex: "0 0 57%", borderRight: thin }}>
            <SectionHeader>SHIP FROM</SectionHeader>
            <div style={{ padding: "4px 8px" }}>
              <FieldRow label="Name:" value={client} />
              <FieldRow label="Address:" />
              <FieldRow label="City/State/Zip:" value={city} />
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "3px", flex: 1 }}>
                  <span style={{ fontWeight: "bold", fontSize: "7pt" }}>SID#:</span>
                  <span style={{ flex: 1, borderBottom: thin }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "7pt", fontWeight: "bold" }}>
                  FOB: <span style={{ display: "inline-block", width: "10px", height: "10px", border: thin }} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "6px 8px" }}>
            <div style={{ fontSize: "7pt", fontWeight: "bold", marginBottom: "3px" }}>
              Bill of Lading Number:{" "}
              <span style={{ borderBottom: thin, display: "inline-block", width: "130px" }} />
            </div>
            <div style={{ color: "#bbb", textAlign: "center", fontSize: "13pt", marginTop: "18px", letterSpacing: "2px" }}>
              BAR CODE SPACE
            </div>
          </div>
        </div>

        {/* ── SHIP TO | CARRIER ── */}
        <div style={{ display: "flex", borderBottom: thin }}>
          <div style={{ flex: "0 0 57%", borderRight: thin }}>
            <SectionHeader>SHIP TO</SectionHeader>
            <div style={{ padding: "4px 8px" }}>
              <FieldRow label="Name:" value={expo_management} />
              <FieldRow label="Address:" value={venue} />
              <FieldRow label="City/State/Zip:" />
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <FieldRow label="Booth:" value={booth_no} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "7pt", fontWeight: "bold" }}>
                  FOB: <span style={{ display: "inline-block", width: "10px", height: "10px", border: thin }} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "4px 8px" }}>
            {["CARRIER NAME:", "Location #:", "Trailer number:", "Seal number(s):", "SCAC:", "Pro number:"].map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", marginBottom: "3px" }}>
                <span style={{ fontWeight: "bold", fontSize: "7pt", whiteSpace: "nowrap", marginRight: "3px" }}>{label}</span>
                <span style={{ flex: 1, borderBottom: thin }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── THIRD PARTY | FREIGHT TERMS ── */}
        <div style={{ display: "flex", borderBottom: thin }}>
          <div style={{ flex: "0 0 57%", borderRight: thin }}>
            <SectionHeader>THIRD PARTY FREIGHT CHARGES BILL TO:</SectionHeader>
            <div style={{ padding: "4px 8px" }}>
              <FieldRow label="Name:" />
              <FieldRow label="Address:" />
              <FieldRow label="City/State/Zip:" />
              <div style={{ fontWeight: "bold", fontSize: "7pt", marginTop: "4px" }}>SPECIAL INSTRUCTIONS:</div>
              <FieldRow label="" />
              <FieldRow label="" />
            </div>
          </div>
          <div style={{ flex: 1, padding: "6px 8px" }}>
            <div style={{ color: "#bbb", textAlign: "center", fontSize: "11pt", marginBottom: "8px", letterSpacing: "2px" }}>
              BAR CODE SPACE
            </div>
            <div style={{ fontWeight: "bold", fontSize: "7pt", marginBottom: "2px" }}>Freight Charge Terms:</div>
            <div style={{ fontSize: "6.5pt", marginBottom: "6px", color: "#444" }}>
              (freight charges are prepaid unless marked otherwise)
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "7pt", marginBottom: "6px" }}>
              {["Prepaid", "Collect", "3rd Party"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <span style={{ display: "inline-block", width: "9px", height: "9px", border: thin }} />
                  {t}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "6.5pt" }}>
              <span style={{ display: "inline-block", width: "9px", height: "9px", border: thin, flexShrink: 0 }} />
              Master Bill of Lading: with attached underlying Bills of Lading
            </div>
          </div>
        </div>

        {/* ── CUSTOMER ORDER INFORMATION ── */}
        <SectionHeader>CUSTOMER ORDER INFORMATION</SectionHeader>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7pt" }}>
          <thead>
            <tr style={{ borderBottom: thin }}>
              {[
                { label: "CUSTOMER ORDER NUMBER", w: "28%" },
                { label: "# PKGS", w: "8%" },
                { label: "WEIGHT", w: "9%" },
                { label: "PALLET/SLIP\n(CIRCLE ONE)", w: "8%" },
                { label: "Y    N", w: "8%" },
                { label: "ADDITIONAL SHIPPER INFO", w: "39%" },
              ].map((col, i) => (
                <th key={i} style={{
                  borderRight: i < 5 ? thin : "none",
                  padding: "3px 4px",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  width: col.w,
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "0.3px solid #bbb", height: "14px" }}>
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <td key={j} style={{ borderRight: j < 5 ? "0.3px solid #bbb" : "none" }} />
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: thin }}>
              <td colSpan={6} style={{ padding: "2px 4px", fontWeight: "bold" }}>GRAND TOTAL</td>
            </tr>
          </tbody>
        </table>

        {/* ── CARRIER INFORMATION ── */}
        <div style={{ borderTop: thin }}>
          <SectionHeader>CARRIER INFORMATION</SectionHeader>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7pt" }}>
            <thead>
              <tr style={{ borderBottom: "0.3px solid #999" }}>
                <th colSpan={2} style={{ borderBottom: thin, borderRight: thin, textAlign: "center", padding: "2px", fontWeight: "bold" }}>HANDLING UNIT</th>
                <th colSpan={2} style={{ borderBottom: thin, borderRight: thin, textAlign: "center", padding: "2px", fontWeight: "bold" }}>PACKAGE</th>
                <th style={{ borderBottom: thin, borderRight: thin }} />
                <th style={{ borderBottom: thin, borderRight: thin }} />
                <th style={{ borderBottom: thin, borderRight: thin, textAlign: "center", padding: "2px", fontWeight: "bold" }}>COMMODITY DESCRIPTION</th>
                <th colSpan={2} style={{ borderBottom: thin, textAlign: "center", padding: "2px", fontWeight: "bold" }}>LTL ONLY</th>
              </tr>
              <tr style={{ borderBottom: thin }}>
                {["QTY", "TYPE", "QTY", "TYPE", "WEIGHT", "H.M.\n(X)", "Commodities requiring special or additional care or attention in handling or stowing must be so marked and packaged as to ensure safe transportation with ordinary care. See Section 2(e) of NMFC Item 360", "NMFC #", "CLASS"].map((h, i) => (
                  <th key={i} style={{
                    borderRight: i < 8 ? thin : "none",
                    padding: "2px 3px",
                    fontWeight: i === 6 ? "normal" : "bold",
                    textAlign: "center",
                    fontSize: i === 6 ? "5.5pt" : "6.5pt",
                    whiteSpace: i === 6 ? "normal" : "pre-line",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "0.3px solid #ccc", height: "16px" }}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} style={{ borderRight: j < 8 ? "0.3px solid #ccc" : "none" }} />
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: thin }}>
                <td colSpan={9} style={{ padding: "2px 4px", fontWeight: "bold", textAlign: "right", fontSize: "7pt" }}>
                  GRAND TOTAL
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── COD / DECLARED VALUE ── */}
        <div style={{ display: "flex", borderTop: thin, fontSize: "6.5pt" }}>
          <div style={{ flex: "0 0 54%", borderRight: thin, padding: "4px 8px" }}>
            Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property as follows:{" "}
            &ldquo;The agreed or declared value of the property is specifically stated by the shipper to be not exceeding{" "}
            <span style={{ borderBottom: thin, display: "inline-block", width: "80px" }} /> per{" "}
            <span style={{ borderBottom: thin, display: "inline-block", width: "60px" }} />.&rdquo;
          </div>
          <div style={{ flex: 1, padding: "4px 8px" }}>
            <div>COD Amount: ${" "}
              <span style={{ borderBottom: thin, display: "inline-block", width: "100px" }} />
            </div>
            <div style={{ marginTop: "4px", display: "flex", gap: "10px", alignItems: "center" }}>
              Fee Terms:
              <Checkbox label="Collect:" />
              <Checkbox label="Prepaid:" />
            </div>
            <Checkbox label="Customer check acceptable:" />
          </div>
        </div>

        {/* ── NOTE ── */}
        <div style={{ borderTop: thin, padding: "3px 8px", fontSize: "6.5pt", fontWeight: "bold" }}>
          NOTE &nbsp; Liability Limitation for loss or damage in this shipment may be applicable. See 49 U.S.C. § 14706(c)(1)(A) and (B).
        </div>

        {/* ── RECEIVED TEXT ── */}
        <div style={{ display: "flex", borderTop: thin, fontSize: "6.5pt" }}>
          <div style={{ flex: "0 0 48%", borderRight: thin, padding: "4px 8px" }}>
            RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper, if applicable, otherwise to the rates, classifications and rules that have been established by the carrier and are available to the shipper, on request, and to all applicable state and federal regulations.
          </div>
          <div style={{ flex: 1, padding: "4px 8px" }}>
            The carrier shall not make delivery of this shipment without payment of freight and all other lawful charges.
            <div style={{ marginTop: "12px", borderTop: thin, paddingTop: "2px", fontWeight: "bold" }}>
              Shipper Signature
            </div>
          </div>
        </div>

        {/* ── SIGNATURE ROW ── */}
        <div style={{ display: "flex", borderTop: thick, fontSize: "7pt" }}>
          <div style={{ flex: "0 0 27%", borderRight: thin, padding: "4px 8px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>SHIPPER SIGNATURE / DATE</div>
            <div style={{ fontSize: "6pt", marginTop: "8px" }}>
              This is to certify that the above named materials are properly classified, packaged, marked and labeled, and are in proper condition for transportation according to the applicable regulations of the DOT.
            </div>
          </div>
          <div style={{ flex: "0 0 15%", borderRight: thin, padding: "4px 8px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Trailer Loaded:</div>
            <Checkbox label="By Shipper" />
            <Checkbox label="By Driver" />
          </div>
          <div style={{ flex: "0 0 22%", borderRight: thin, padding: "4px 8px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Freight Counted:</div>
            <Checkbox label="By Shipper" />
            <Checkbox label="By Driver/pallets said to contain" />
            <Checkbox label="By Driver/Pieces" />
          </div>
          <div style={{ flex: 1, padding: "4px 8px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>CARRIER SIGNATURE / PICKUP DATE</div>
            <div style={{ fontSize: "6pt" }}>
              Carrier acknowledges receipt of packages and required placards. Carrier certifies emergency response information was made available and/or carrier has the DOT emergency response guidebook or equivalent documentation in the vehicle.
            </div>
            <div style={{ marginTop: "4px", fontSize: "6pt", fontStyle: "italic" }}>
              Property described above is received in good order, except as noted.
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          @page { margin: 0.5cm; size: letter; }
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
}

export default function BOLPage() {
  return (
    <Suspense>
      <BOLContent />
    </Suspense>
  );
}
