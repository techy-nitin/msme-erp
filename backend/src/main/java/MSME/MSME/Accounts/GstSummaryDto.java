package MSME.MSME.Accounts;

import java.math.BigDecimal;

public class GstSummaryDto {
    private String period;

    private BigDecimal outputGST;

    private BigDecimal inputGST;

    private BigDecimal netGST;

    private String status;

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getOutputGST() {
        return outputGST;
    }

    public void setOutputGST(BigDecimal outputGST) {
        this.outputGST = outputGST;
    }

    public BigDecimal getInputGST() {
        return inputGST;
    }

    public void setInputGST(BigDecimal inputGST) {
        this.inputGST = inputGST;
    }

    public BigDecimal getNetGST() {
        return netGST;
    }

    public void setNetGST(BigDecimal netGST) {
        this.netGST = netGST;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
