from fastapi import APIRouter, UploadFile, File, HTTPException
import openpyxl
import io
from datetime import date, datetime
from typing import Any

router = APIRouter()

COLUMNS = ["client", "city", "venue", "expo name", "expo start date", "expo end date", "expo management", "booth no"]


def _parse_date(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, (date, datetime)):
        d = value.date() if isinstance(value, datetime) else value
        return d.strftime("%d.%m.%Y")
    s = str(value).strip()
    for fmt in ("%d.%m.%Y", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%d.%m.%Y")
        except ValueError:
            pass
    return s


@router.post("/bulk-upload/preview")
async def bulk_upload_preview(file: UploadFile = File(...)):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Sadece .xlsx veya .xls dosyası yükleyebilirsiniz.")

    content = await file.read()
    try:
        wb = openpyxl.load_workbook(io.BytesIO(content), data_only=True)
    except Exception:
        raise HTTPException(status_code=400, detail="Excel dosyası okunamadı.")

    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        raise HTTPException(status_code=400, detail="Dosya boş.")

    headers = [str(h).strip().lower() if h is not None else "" for h in rows[0]]

    col_map: dict[str, int] = {}
    missing_cols = []
    for col in COLUMNS:
        try:
            col_map[col] = headers.index(col)
        except ValueError:
            missing_cols.append(col)

    if missing_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Sütun bulunamadı: {', '.join(missing_cols)}. Beklenen: {', '.join(COLUMNS)}",
        )

    result = []
    for row in rows[1:]:
        def cell(col: str) -> str:
            v = row[col_map[col]]
            return str(v).strip() if v is not None else ""

        record = {
            "client": cell("client"),
            "city": cell("city"),
            "venue": cell("venue"),
            "expo_name": cell("expo name"),
            "expo_start_date": _parse_date(row[col_map["expo start date"]]),
            "expo_end_date": _parse_date(row[col_map["expo end date"]]),
            "expo_management": cell("expo management"),
            "booth_no": cell("booth no"),
        }

        if not any(record.values()):
            continue

        result.append(record)

    return {"rows": result, "total": len(result)}
