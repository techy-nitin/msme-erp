package MSME.MSME.Accounts;

import org.springframework.stereotype.Service;
import MSME.MSME.Invoice.invoiceRepo;
import MSME.MSME.Payment.PaymentRepository;
import MSME.MSME.Expense.ExpenseRepository;
@Service
public class AccountsService {

    private final invoiceRepo invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;

    public AccountsService(invoiceRepo invoiceRepository,
                           PaymentRepository paymentRepository,
                           ExpenseRepository expenseRepository) {

        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.expenseRepository = expenseRepository;
    }

    public AccountsResponse getAccountsDashboard() {

        AccountsResponse dto = new AccountsResponse();

        dto.setTotalRevenue(
                invoiceRepository.getTotalRevenue());

        dto.setTotalExpense(
                expenseRepository.getTotalExpense());

        dto.setNetProfit(
                invoiceRepository.getTotalRevenue()
                        .subtract(expenseRepository.getTotalExpense())
        );

        dto.setGstPayable(
                invoiceRepository.getCurrentMonthGST()
        );

        return dto;
    }
}