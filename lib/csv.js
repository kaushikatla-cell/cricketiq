function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const safe = String(value).replace(/"/g, '""');
  return /[",\n]/.test(safe) ? `"${safe}"` : safe;
}

export function toCsv(rows) {
  if (!rows.length) return "";
  const columns = Object.keys(rows[0]);
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((key) => escapeCsv(row[key])).join(","));
  return [header, ...lines].join("\n");
}

export function downloadCsv(filename, rows) {
  if (typeof window === "undefined") return;
  const csvContent = toCsv(rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
