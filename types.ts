export interface Bill {
  invoiceNo: string;
  date: string; // Invoice Date
  billValue: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  overDueDays: number;
}

export interface Stockist {
  name: string;
  phone?: string;
  mobile?: string;
  totalOutstanding: number;
  bills: Bill[];
}

export interface MR {
  name: string; // e.g., BERHAMPORE-[AMIT DEY]
  totalOutstanding: number;
  stockists: Stockist[];
}

export interface ReportData {
  agencyName: string;
  reportDate: string;
  grandTotal: number;
  mrs: MR[];
}

export interface ExtractionStatus {
  loading: boolean;
  error?: string;
  step?: string;
}
