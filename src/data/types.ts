// Shared types for the Fulcrum Memo data layer.
//
// Pipeline-emitted files (baaSpreadHistory.ts, hyOasHistory.ts, hygHistory.ts, etc.)
// import DailyDataPoint from here as a type-only import, so the interface is
// declared once and stripped from the bundle by Vite.

export interface DailyDataPoint {
  date: string;   // YYYY-MM-DD
  value: number;  // units depend on the source series — see file header
}
