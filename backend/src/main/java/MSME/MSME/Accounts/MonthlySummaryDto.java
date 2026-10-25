package MSME.MSME.Accounts;

import java.math.BigDecimal;

public class MonthlySummaryDto {
    private String month;

    private BigDecimal revenue;

    private BigDecimal expense;

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }
}
