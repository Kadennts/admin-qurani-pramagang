export function formatTimezoneLabel(iana: string): string {
  if (!iana) return "";

  const mapping: Record<string, string> = {
    "Asia/Jakarta": "WIB",
    "Asia/Pontianak": "WIB",
    "Asia/Makassar": "WITA",
    "Asia/Denpasar": "WITA",
    "Asia/Mataram": "WITA",
    "Asia/Ujung_Pandang": "WITA",
    "Asia/Jayapura": "WIT",
    "Asia/Dhaka": "BST",
    "Asia/Karachi": "PKT",
    "Asia/Qatar": "AST",
    "Asia/Riyadh": "AST",
    "America/New_York": "EST/EDT",
    "America/Chicago": "CST/CDT",
    "America/Denver": "MST/MDT",
    "America/Phoenix": "MST",
    "America/Los_Angeles": "PST/PDT",
    "America/Anchorage": "AKST/AKDT",
    "America/Honolulu": "HST",
    "Africa/Cairo": "EET/EEST",
    "Europe/Istanbul": "TRT",
    "Europe/London": "GMT/BST",
    "Europe/Paris": "CET/CEST",
    "Asia/Dubai": "GST",
    "Asia/Singapore": "SGT",
    "Asia/Kuala_Lumpur": "MYT",
    "Asia/Tokyo": "JST",
    "Asia/Seoul": "KST",
    "Australia/Sydney": "AEST/AEDT",
    "Australia/Perth": "AWST",
  };

  const code = mapping[iana] || iana.split("/").pop()?.replace(/_/g, " ") || iana;

  try {
    // We use a fixed date to get the standard offset, or use current for dynamic
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: iana,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value || "";
    return `${code} (${offset})`;
  } catch {
    return code;
  }
}
