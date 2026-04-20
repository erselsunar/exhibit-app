from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from io import BytesIO
from datetime import datetime, timedelta

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

router = APIRouter()

W, H = letter  # 612 x 792 pts


class RowData(BaseModel):
    client: str = ""
    city: str = ""
    venue: str = ""
    expo_name: str = ""
    expo_start_date: str = ""
    expo_end_date: str = ""
    expo_management: str = ""
    booth_no: str = ""


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _today() -> datetime:
    return datetime.now()


def _section_header(c: canvas.Canvas, x: float, y: float, w: float, h: float, text: str):
    """Draw a black filled section header bar."""
    c.setFillColor(colors.black)
    c.rect(x, y - h, w, h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(x + w / 2, y - h + 3, text)
    c.setFillColor(colors.black)


def _hline(c: canvas.Canvas, x1: float, y: float, x2: float, lw: float = 0.5):
    c.setLineWidth(lw)
    c.line(x1, y, x2, y)


def _vline(c: canvas.Canvas, x: float, y1: float, y2: float, lw: float = 0.5):
    c.setLineWidth(lw)
    c.line(x, y1, x, y2)


def _label_val(c: canvas.Canvas, x: float, y: float, label: str, value: str,
               label_font=("Helvetica-Bold", 7), val_font=("Helvetica", 8)):
    c.setFont(*label_font)
    c.drawString(x, y, label)
    label_w = c.stringWidth(label, label_font[0], label_font[1])
    c.setFont(*val_font)
    c.drawString(x + label_w + 2, y, value)


def _underline_field(c: canvas.Canvas, x: float, y: float, w: float, label: str, value: str = ""):
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x, y + 2, label)
    lw = c.stringWidth(label, "Helvetica-Bold", 7) + 4
    c.setLineWidth(0.5)
    c.line(x + lw, y, x + lw + w, y)
    if value:
        c.setFont("Helvetica", 8)
        c.drawString(x + lw + 2, y + 2, value)


# ─────────────────────────────────────────────
#  BILL OF LADING
# ─────────────────────────────────────────────

def _generate_bol(data: RowData) -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)

    lm, rm = 20.0, W - 20.0
    fw = rm - lm
    today_str = _today().strftime("%m/%d/%Y")

    # Outer border
    c.setLineWidth(1)
    c.rect(lm, 20, fw, H - 40)

    # ── TITLE ROW ──────────────────────────────
    cy = H - 20  # current top y
    th = 24
    _hline(c, lm, cy - th, rm, 1)
    c.setFont("Helvetica", 8)
    c.drawString(lm + 4, cy - 16, f"Date: {today_str}")
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(W / 2, cy - 17, "BILL OF LADING")
    c.setFont("Helvetica", 8)
    c.drawRightString(rm - 4, cy - 16, "Page 1 of ______")
    cy -= th

    # ── TWO-COLUMN DIVIDE ─────────────────────
    mid = lm + 330  # left col width ~330, right ~242

    # ── SHIP FROM ─────────────────────────────
    sf_header_h = 12
    sf_body_h = 62
    sf_total = sf_header_h + sf_body_h

    _section_header(c, lm, cy, mid - lm, sf_header_h, "SHIP FROM")
    # Right side of same row: BOL Number
    c.setFont("Helvetica-Bold", 7)
    c.drawString(mid + 4, cy - 9, "Bill of Lading Number:")
    c.setLineWidth(0.5)
    c.line(mid + 95, cy - 7, rm - 4, cy - 7)
    _hline(c, lm, cy - sf_header_h - sf_body_h, rm, 0.5)  # bottom of ship-from row
    _vline(c, mid, cy, cy - sf_total, 0.5)

    # BAR CODE SPACE (right side, lower half of right column)
    bar_y = cy - sf_header_h - 15
    c.setFont("Helvetica", 20)
    c.setFillColor(colors.lightgrey)
    c.drawCentredString(mid + (rm - mid) / 2, bar_y - 20, "BAR CODE SPACE")
    c.setFillColor(colors.black)

    # Ship From fields
    by = cy - sf_header_h - 2
    row_gap = 12
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, by - 9, "Name:")
    c.setFont("Helvetica", 9)
    c.drawString(lm + 32, by - 9, data.client)
    _hline(c, lm + 3, by - 11, mid - 3)

    by -= row_gap
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, by - 9, "Address:")
    _hline(c, lm + 44, by - 11, mid - 3)

    by -= row_gap
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, by - 9, "City/State/Zip:")
    c.setFont("Helvetica", 9)
    c.drawString(lm + 68, by - 9, data.city)
    _hline(c, lm + 68, by - 11, mid - 3)

    by -= row_gap
    _underline_field(c, lm + 3, by - 11, 60, "SID#:")
    c.setFont("Helvetica-Bold", 7)
    c.drawString(mid - 55, by - 9, "FOB:")
    c.rect(mid - 25, by - 11, 10, 10)

    cy -= sf_total

    # ── SHIP TO ───────────────────────────────
    st_header_h = 12
    st_body_h = 68
    st_total = st_header_h + st_body_h

    _section_header(c, lm, cy, mid - lm, st_header_h, "SHIP TO")

    # Right side: CARRIER NAME
    c.setFont("Helvetica-Bold", 7)
    c.drawString(mid + 4, cy - 9, "CARRIER NAME:")
    c.line(mid + 65, cy - 7, rm - 4, cy - 7)

    _hline(c, lm, cy - st_header_h - st_body_h, rm, 0.5)
    _vline(c, mid, cy, cy - st_total, 0.5)

    # Right: carrier detail fields
    cr_y = cy - st_header_h - 2
    cr_gap = 11
    for label in ["Location #:", "Trailer number:", "Seal number(s):", "SCAC:", "Pro number:"]:
        c.setFont("Helvetica-Bold", 7)
        c.drawString(mid + 4, cr_y - 9, label)
        lw = c.stringWidth(label, "Helvetica-Bold", 7)
        c.line(mid + 4 + lw + 2, cr_y - 7, rm - 4, cr_y - 7)
        cr_y -= cr_gap

    # Ship To fields
    sy = cy - st_header_h - 2
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, sy - 9, "Name:")
    c.setFont("Helvetica", 9)
    c.drawString(lm + 32, sy - 9, data.expo_management)
    _hline(c, lm + 3, sy - 11, mid - 3)

    sy -= 12
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, sy - 9, "Address:")
    c.setFont("Helvetica", 9)
    c.drawString(lm + 44, sy - 9, data.venue)
    _hline(c, lm + 44, sy - 11, mid - 3)

    sy -= 12
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, sy - 9, "City/State/Zip:")
    _hline(c, lm + 68, sy - 11, mid - 3)

    sy -= 12
    c.setFont("Helvetica-Bold", 7)
    _underline_field(c, lm + 3, sy - 11, 60, "Booth:", data.booth_no)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(mid - 55, sy - 9, "FOB:")
    c.rect(mid - 25, sy - 11, 10, 10)

    cy -= st_total

    # ── THIRD PARTY FREIGHT ───────────────────
    tp_header_h = 12
    tp_body_h = 72
    tp_total = tp_header_h + tp_body_h

    _section_header(c, lm, cy, mid - lm, tp_header_h, "THIRD PARTY FREIGHT CHARGES BILL TO:")
    _hline(c, lm, cy - tp_header_h - tp_body_h, rm, 0.5)
    _vline(c, mid, cy, cy - tp_total, 0.5)

    # Right side: barcode + freight terms
    rt_y = cy - tp_header_h - 10
    c.setFont("Helvetica", 14)
    c.setFillColor(colors.lightgrey)
    c.drawCentredString(mid + (rm - mid) / 2, rt_y - 10, "BAR CODE SPACE")
    c.setFillColor(colors.black)

    ft_y = rt_y - 30
    c.setFont("Helvetica-Bold", 7)
    c.drawString(mid + 4, ft_y, "Freight Charge Terms:")
    ft_y -= 10
    c.setFont("Helvetica", 7)
    c.drawString(mid + 4, ft_y, "(freight charges are prepaid unless marked otherwise)")
    ft_y -= 12
    for label in ["Prepaid", "Collect", "3rd Party"]:
        c.rect(mid + 4, ft_y - 2, 8, 8)
        c.drawString(mid + 14, ft_y, label)
        mid += (rm - mid) // 3
    mid = lm + 330  # reset

    # Third party fields
    tp_y = cy - tp_header_h - 2
    for label in ["Name:", "Address:", "City/State/Zip:"]:
        c.setFont("Helvetica-Bold", 7)
        c.drawString(lm + 3, tp_y - 9, label)
        lw = c.stringWidth(label, "Helvetica-Bold", 7)
        c.line(lm + 3 + lw + 2, tp_y - 7, mid - 3, tp_y - 7)
        tp_y -= 12
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, tp_y - 9, "SPECIAL INSTRUCTIONS:")
    tp_y -= 12
    c.line(lm + 3, tp_y - 7, mid - 3, tp_y - 7)
    tp_y -= 12
    c.line(lm + 3, tp_y - 7, mid - 3, tp_y - 7)

    cy -= tp_total

    # ── CUSTOMER ORDER INFORMATION ────────────
    co_header_h = 12
    co_body_h = 105
    co_total = co_header_h + co_body_h

    _section_header(c, lm, cy, fw, co_header_h, "CUSTOMER ORDER INFORMATION")
    _hline(c, lm, cy - co_header_h - co_body_h, rm, 0.5)

    # Sub-header row
    sh_y = cy - co_header_h
    sh_h = 12
    col_widths = [160, 50, 55, 55, 55, 197]
    col_labels = ["CUSTOMER ORDER NUMBER", "# PKGS", "WEIGHT", "PALLET/SLIP\n(CIRCLE ONE)", "Y   N", "ADDITIONAL SHIPPER INFO"]
    cx = lm
    for i, (cw, cl) in enumerate(zip(col_widths, col_labels)):
        _vline(c, cx, sh_y, sh_y - sh_h)
        c.setFont("Helvetica-Bold", 6)
        lines = cl.split("\n")
        for li, ln in enumerate(lines):
            c.drawCentredString(cx + cw / 2, sh_y - 8 - li * 8, ln)
        cx += cw
    _vline(c, rm, sh_y, sh_y - sh_h)
    _hline(c, lm, sh_y - sh_h, rm)

    # Data rows
    row_y = sh_y - sh_h
    for _ in range(7):
        _hline(c, lm, row_y - 10, rm, 0.3)
        cx2 = lm
        for cw in col_widths:
            _vline(c, cx2, row_y, row_y - 10, 0.3)
            cx2 += cw
        _vline(c, rm, row_y, row_y - 10, 0.3)
        row_y -= 10

    # GRAND TOTAL row
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, row_y - 9, "GRAND TOTAL")
    _hline(c, lm, row_y - 12, rm)

    cy -= co_total

    # ── CARRIER INFORMATION ───────────────────
    ci_header_h = 12
    ci_body_h = 118
    ci_total = ci_header_h + ci_body_h

    _section_header(c, lm, cy, fw, ci_header_h, "CARRIER INFORMATION")
    _hline(c, lm, cy - ci_header_h - ci_body_h, rm, 0.5)

    # Sub-header
    ci_sh_y = cy - ci_header_h
    ci_col_w = [30, 45, 30, 45, 50, 30, 180, 80, 50]
    ci_labels = ["QTY", "TYPE", "QTY", "TYPE", "WEIGHT", "H.M.\n(X)", "COMMODITY DESCRIPTION", "NMFC #", "CLASS"]
    ci_group_labels = [("HANDLING UNIT", 75, 0), ("PACKAGE", 75, 75), ("", 50, 150), ("", 30, 200), ("LTL ONLY", 130, 342)]

    # Group headers
    for glabel, gw, gx in ci_group_labels:
        if glabel:
            c.setFont("Helvetica-Bold", 6)
            c.drawCentredString(lm + gx + gw / 2, ci_sh_y - 6, glabel)
    _hline(c, lm, ci_sh_y - 12, rm, 0.5)

    ci_sh2_y = ci_sh_y - 12
    cix = lm
    for cw, cl in zip(ci_col_w, ci_labels):
        _vline(c, cix, ci_sh2_y, ci_sh2_y - 12)
        c.setFont("Helvetica-Bold", 6)
        for li, ln in enumerate(cl.split("\n")):
            c.drawCentredString(cix + cw / 2, ci_sh2_y - 8 - li * 7, ln)
        cix += cw
    _vline(c, rm, ci_sh2_y, ci_sh2_y - 12)
    _hline(c, lm, ci_sh2_y - 12, rm)

    ci_row_y = ci_sh2_y - 12
    for _ in range(6):
        _hline(c, lm, ci_row_y - 13, rm, 0.3)
        cix2 = lm
        for cw in ci_col_w:
            _vline(c, cix2, ci_row_y, ci_row_y - 13, 0.3)
            cix2 += cw
        _vline(c, rm, ci_row_y, ci_row_y - 13, 0.3)
        ci_row_y -= 13

    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, ci_row_y - 9, "GRAND TOTAL")
    _hline(c, lm, ci_row_y - 12, rm)

    cy -= ci_total

    # ── NOTES & COD ROW ──────────────────────
    note_h = 32
    c.setFont("Helvetica", 6)
    note_text = (
        "Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or "
        "declared value of the property as follows: \"The agreed or declared value of the property is specifically "
        "stated by the shipper to be not exceeding _____________ per _____________.\" "
    )
    text_obj = c.beginText(lm + 3, cy - 8)
    text_obj.setFont("Helvetica", 6)
    max_w = 300
    words = note_text.split()
    line, lines_out = "", []
    for w in words:
        test = (line + " " + w).strip()
        if c.stringWidth(test, "Helvetica", 6) < max_w:
            line = test
        else:
            lines_out.append(line)
            line = w
    lines_out.append(line)
    for ln in lines_out[:4]:
        text_obj.textLine(ln)
    c.drawText(text_obj)

    _vline(c, lm + 310, cy, cy - note_h)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 314, cy - 10, "COD Amount: $")
    c.line(lm + 380, cy - 8, rm - 4, cy - 8)
    c.drawString(lm + 314, cy - 22, "Fee Terms:")
    c.drawString(lm + 360, cy - 22, "Collect:")
    c.rect(lm + 390, cy - 24, 8, 8)
    c.drawString(lm + 405, cy - 22, "Prepaid:")
    c.rect(lm + 435, cy - 24, 8, 8)
    c.setFont("Helvetica", 6)
    c.drawString(lm + 314, cy - 32, "Customer check acceptable:")
    c.rect(lm + 435, cy - 34, 8, 8)
    _hline(c, lm, cy - note_h, rm)
    cy -= note_h

    # ── NOTE ROW ─────────────────────────────
    nt_h = 16
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(lm + 3, cy - 10,
        "NOTE  Liability Limitation for loss or damage in this shipment may be applicable. "
        "See 49 U.S.C. § 14706(c)(1)(A) and (B).")
    _hline(c, lm, cy - nt_h, rm)
    cy -= nt_h

    # ── RECEIVED TEXT ────────────────────────
    rx_h = 32
    recv_txt = (
        "RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing "
        "between the carrier and shipper, if applicable, otherwise to the rates, classifications and rules that "
        "have been established by the carrier and are available to the shipper, on request, and to all applicable "
        "state and federal regulations."
    )
    _vline(c, lm + 290, cy, cy - rx_h)
    text_obj2 = c.beginText(lm + 3, cy - 8)
    text_obj2.setFont("Helvetica", 6)
    words2 = recv_txt.split()
    line2, lines2 = "", []
    for w in words2:
        test2 = (line2 + " " + w).strip()
        if c.stringWidth(test2, "Helvetica", 6) < 284:
            line2 = test2
        else:
            lines2.append(line2)
            line2 = w
    lines2.append(line2)
    for ln in lines2[:4]:
        text_obj2.textLine(ln)
    c.drawText(text_obj2)

    c.setFont("Helvetica", 6)
    right_recv = (
        "The carrier shall not make delivery of this shipment without payment of freight "
        "and all other lawful charges."
    )
    c.drawString(lm + 294, cy - 8, right_recv[:70])
    c.drawString(lm + 294, cy - 16, right_recv[70:])
    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 294, cy - 28, "_______________________________  Shipper Signature")
    _hline(c, lm, cy - rx_h, rm)
    cy -= rx_h

    # ── SIGNATURE ROW ────────────────────────
    sig_h = max(cy - 22, 38)
    _vline(c, lm + 165, cy, 22)
    _vline(c, lm + 260, cy, 22)
    _vline(c, lm + 390, cy, 22)

    c.setFont("Helvetica-Bold", 7)
    c.drawString(lm + 3, cy - 10, "SHIPPER SIGNATURE / DATE")
    c.drawString(lm + 170, cy - 10, "Trailer Loaded:")
    c.drawString(lm + 265, cy - 10, "Freight Counted:")
    c.drawString(lm + 395, cy - 10, "CARRIER SIGNATURE / PICKUP DATE")

    for label, bx, by_offset in [
        ("By Shipper", lm + 170, cy - 22),
        ("By Driver", lm + 170, cy - 32),
        ("By Shipper", lm + 265, cy - 22),
        ("By Driver/pallets said to contain", lm + 265, cy - 32),
        ("By Driver/Pieces", lm + 265, cy - 42),
    ]:
        c.rect(bx, by_offset, 8, 8)
        c.setFont("Helvetica", 6.5)
        c.drawString(bx + 11, by_offset + 1, label)

    c.setFont("Helvetica", 6)
    cert_text = (
        "This is to certify that the above named materials are properly classified, "
        "packaged, marked and labeled, and are in proper condition for transportation "
        "according to the applicable regulations of the DOT."
    )
    cty = cy - 18
    for seg in [cert_text[i:i+52] for i in range(0, len(cert_text), 52)][:4]:
        c.drawString(lm + 3, cty, seg)
        cty -= 8

    c.save()
    return buf.getvalue()


# ─────────────────────────────────────────────
#  SHIPPING TAG
# ─────────────────────────────────────────────

def _draw_tag_panel(c: canvas.Canvas, px: float, py: float, pw: float, ph: float, data: RowData):
    """Draw one Freeman-style shipping tag panel."""
    today = _today()
    deadline = today + timedelta(days=5)
    today_str = today.strftime("%B %d, %Y")
    deadline_str = deadline.strftime("%B %d, %Y")

    pad = 9
    c.setLineWidth(1.2)
    c.setStrokeColor(colors.black)
    c.rect(px, py, pw, ph)

    # ── Freeman logo ──────────────────────────
    top_y = py + ph
    logo_y = top_y - 22
    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(colors.HexColor("#1A3A6B"))
    c.drawString(px + pad, logo_y, "Freeman")
    tw = c.stringWidth("Freeman", "Helvetica-Bold", 15)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#00AEEF"))
    c.drawString(px + pad + tw + 1, logo_y + 4, ".")

    # ── RUSH banner ───────────────────────────
    rush_y = top_y - 44
    rush_h = 26
    c.setFillColor(colors.black)
    c.rect(px, rush_y, pw, rush_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(px + pw / 2, rush_y + 5, "R U S H")

    # ── DO NOT DELAY ──────────────────────────
    dnd_y = rush_y - 17
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(px + pw / 2, dnd_y, "D O   N O T   D E L A Y")

    # ── Separator ─────────────────────────────
    sep_y = dnd_y - 7
    c.setLineWidth(0.8)
    c.setStrokeColor(colors.HexColor("#00AEEF"))
    c.line(px, sep_y, px + pw, sep_y)
    c.setStrokeColor(colors.black)

    # ── Dates ─────────────────────────────────
    date_y = sep_y - 14
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.black)
    c.drawString(px + pad, date_y, f"RECEIVING DATE BEGINS: {today_str}")
    date_y -= 13
    c.drawString(px + pad, date_y, f"DEADLINE DATE IS: {deadline_str}")

    # ── TO field ──────────────────────────────
    to_y = date_y - 18
    c.setFont("Helvetica", 8)
    c.drawString(px + pad, to_y, "TO: ")
    c.setLineWidth(0.5)
    c.line(px + pad + 22, to_y - 1, px + pw - pad, to_y - 1)
    to_y -= 12
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(px + pw / 2, to_y, data.expo_name)
    to_y -= 12
    c.setFont("Helvetica", 8)
    c.drawString(px + pad + 8, to_y, f"C/O {data.expo_management}")
    to_y -= 11
    c.drawString(px + pad + 8, to_y, data.venue)
    to_y -= 11
    c.drawString(px + pad + 8, to_y, data.city)

    # ── Blue separator ────────────────────────
    bs_y = to_y - 10
    c.setLineWidth(0.8)
    c.setStrokeColor(colors.HexColor("#00AEEF"))
    c.line(px, bs_y, px + pw, bs_y)
    c.setStrokeColor(colors.black)

    # ── Advance Warehouse Shipping Labels ─────
    awsl_y = bs_y - 15
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#00AEEF"))
    c.drawCentredString(px + pw / 2, awsl_y, "Advance Warehouse Shipping Labels")

    # ── EVENT ────────────────────────────────
    ev_y = awsl_y - 16
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(px + pad, ev_y, "EVENT: ")
    c.setFont("Helvetica", 8)
    ev_lw = c.stringWidth("EVENT: ", "Helvetica-Bold", 8)
    c.drawString(px + pad + ev_lw, ev_y, data.expo_name)

    # ── BOOTH NUMBER ──────────────────────────
    bn_y = ev_y - 13
    c.setFont("Helvetica-Bold", 8)
    c.drawString(px + pad, bn_y, "BOOTH NUMBER: ")
    c.setLineWidth(0.5)
    bn_lw = c.stringWidth("BOOTH NUMBER: ", "Helvetica-Bold", 8)
    c.line(px + pad + bn_lw, bn_y - 1, px + pw - pad, bn_y - 1)
    c.setFont("Helvetica", 9)
    c.drawString(px + pad + bn_lw + 2, bn_y, data.booth_no)

    # ── NUMBER OF PIECES ─────────────────────
    nop_y = bn_y - 14
    c.setFont("Helvetica-Bold", 8)
    c.drawString(px + pad, nop_y, "NUMBER ")
    nw = c.stringWidth("NUMBER ", "Helvetica-Bold", 8)
    c.line(px + pad + nw, nop_y - 1, px + pad + nw + 40, nop_y - 1)
    c.drawString(px + pad + nw + 42, nop_y, " OF ")
    ow = c.stringWidth(" OF ", "Helvetica-Bold", 8)
    c.line(px + pad + nw + 42 + ow, nop_y - 1, px + pad + nw + 42 + ow + 40, nop_y - 1)
    c.drawString(px + pad + nw + 42 + ow + 42, nop_y, " PIECES")


def _generate_shipping_tag(data: RowData) -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)

    margin = 28
    gap = 14
    panel_w = (W - 2 * margin - gap) / 2
    panel_h = 360
    panel_y = (H - panel_h) / 2

    _draw_tag_panel(c, margin, panel_y, panel_w, panel_h, data)
    _draw_tag_panel(c, margin + panel_w + gap, panel_y, panel_w, panel_h, data)

    c.save()
    return buf.getvalue()


# ─────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────

@router.post("/pdf/bol")
def pdf_bol(data: RowData):
    pdf_bytes = _generate_bol(data)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="bill-of-lading.pdf"'},
    )


@router.post("/pdf/shipping-tag")
def pdf_shipping_tag(data: RowData):
    pdf_bytes = _generate_shipping_tag(data)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="shipping-tag.pdf"'},
    )
