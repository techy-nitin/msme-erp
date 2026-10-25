package MSME.MSME.Accounts;

import java.math.BigDecimal;
import java.util.List;

public class AccountsResponse {
    private BigDecimal totalRevenue;

    private BigDecimal totalExpense;

    private BigDecimal netProfit;

    private BigDecimal gstPayable;

    private List<MonthlySummaryDto> monthlySummary;

    private List<GstSummaryDto> gstSummary;

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(BigDecimal netProfit) {
        this.netProfit = netProfit;
    }

    public BigDecimal getGstPayable() {
        return gstPayable;
    }

    public void setGstPayable(BigDecimal gstPayable) {
        this.gstPayable = gstPayable;
    }

    public List<MonthlySummaryDto> getMonthlySummary() {
        return monthlySummary;
    }

    public void setMonthlySummary(List<MonthlySummaryDto> monthlySummary) {
        this.monthlySummary = monthlySummary;
    }

    public List<GstSummaryDto> getGstSummary() {
        return gstSummary;
    }

    public void setGstSummary(List<GstSummaryDto> gstSummary) {
        this.gstSummary = gstSummary;
    }
}
