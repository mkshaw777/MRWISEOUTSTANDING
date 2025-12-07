import { GoogleGenAI, Type } from "@google/genai";
import { ReportData } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert data extraction assistant specialized in financial statements. 
Your task is to extract structured JSON data from a PDF "Outstanding Statement".

The PDF contains a list of Medical Representatives (MRs), their Stockists, and individual unpaid bills.

Structure the output strictly according to the schema:
1. Identify the Agency Name and Report Date (Outstanding as on...).
2. Identify each MR Section. MR sections usually start with a location and name in brackets (e.g., "BERHAMPORE-[AMIT DEY]") and have a total amount on the right.
3. Identify Stockists within MR sections (usually starting with a hyphen).
4. For each Stockist, extract the list of bills. 
   - Map columns: INVOICE, DATE, BILL VALUE, PAID/ADJUSTED, BALANCE, DUE DATE, O/D.
   - Extract "Date of deposit" if mentioned, otherwise map 'Due Date' to 'dueDate'.
   - Ignore asterisks (*).
   - Ensure numbers are parsed correctly (remove commas).

If a value is 0.00, keep it as 0.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    agencyName: { type: Type.STRING },
    reportDate: { type: Type.STRING },
    grandTotal: { type: Type.NUMBER },
    mrs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          totalOutstanding: { type: Type.NUMBER },
          stockists: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                phone: { type: Type.STRING, nullable: true },
                mobile: { type: Type.STRING, nullable: true },
                totalOutstanding: { type: Type.NUMBER },
                bills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      invoiceNo: { type: Type.STRING },
                      date: { type: Type.STRING },
                      billValue: { type: Type.NUMBER },
                      paidAmount: { type: Type.NUMBER },
                      balance: { type: Type.NUMBER },
                      dueDate: { type: Type.STRING },
                      overDueDays: { type: Type.NUMBER },
                    },
                    required: ["invoiceNo", "billValue", "balance"]
                  },
                },
              },
              required: ["name", "bills", "totalOutstanding"]
            },
          },
        },
        required: ["name", "stockists", "totalOutstanding"]
      },
    },
  },
  required: ["agencyName", "reportDate", "grandTotal", "mrs"],
};

export const extractReportFromPDF = async (base64Pdf: string): Promise<ReportData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf,
              },
            },
            {
              text: "Extract the outstanding statement data from this PDF.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No data returned from AI");

    // Clean up markdown if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "");
    }

    const parsedData = JSON.parse(text) as ReportData;
    return parsedData;
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    
    // Handle specific XHR/RPC errors common in browser proxies with large files
    if (
      error.message?.includes("Rpc failed") || 
      error.message?.includes("xhr error") ||
      error.message?.includes("error code: 6")
    ) {
       throw new Error("Network request failed. The PDF file is likely too large for the browser to handle (Limit ~4MB). Please split the PDF into smaller pages and try again.");
    }

    throw error;
  }
};