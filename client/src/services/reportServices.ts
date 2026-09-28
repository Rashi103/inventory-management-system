import api from "./axios";

export interface SalesPeriodItem {
  period: string;
  bills: number;
  revenue: string;
}

export interface SalesPeriodResponse {
  period: string;
  data: SalesPeriodItem[];
}

export const getSalesPeriodReport = async (
  period: "daily" | "weekly" | "monthly" | "yearly"
): Promise<SalesPeriodResponse> => {
  const response = await api.get("/reports/sales", {
    params: {
      period,
    },
  });

  return response.data;
};