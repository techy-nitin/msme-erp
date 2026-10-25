package MSME.MSME.Expense;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // ============================================
    // CREATE
    // ============================================

    public ExpenseResponse createExpense(ExpenseRequest request) {

        ExpenseEntity expense = new ExpenseEntity();

        expense.setExpenseNumber(generateExpenseNumber());
        expense.setExpenseName(request.getExpenseName());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(request.getCategory());
        expense.setVendor(request.getVendor());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setGstAmount(request.getGstAmount());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setStatus(request.getStatus());

        expense = expenseRepository.save(expense);

        return convertToResponse(expense);
    }

    // ============================================
    // GET ALL
    // ============================================

    public List<ExpenseResponse> getAllExpenses() {

        return expenseRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ============================================
    // GET BY ID
    // ============================================

    public ExpenseResponse getExpense(Long id) {

        ExpenseEntity expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Expense not found"));

        return convertToResponse(expense);
    }

    // ============================================
    // UPDATE
    // ============================================

    public ExpenseResponse updateExpense(Long id,
                                         ExpenseRequest request) {

        ExpenseEntity expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Expense not found"));

        expense.setExpenseName(request.getExpenseName());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(request.getCategory());
        expense.setVendor(request.getVendor());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setGstAmount(request.getGstAmount());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setStatus(request.getStatus());

        expenseRepository.save(expense);

        return convertToResponse(expense);
    }

    // ============================================
    // DELETE
    // ============================================

    public void deleteExpense(Long id) {

        ExpenseEntity expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Expense not found"));

        expenseRepository.delete(expense);
    }

    // ============================================
    // AUTO NUMBER
    // ============================================

    private String generateExpenseNumber() {

        long count = expenseRepository.count() + 1;

        return String.format(
                "EXP-%d-%04d",
                Year.now().getValue(),
                count
        );
    }

    // ============================================
    // DTO CONVERTER
    // ============================================

    private ExpenseResponse convertToResponse(ExpenseEntity expense) {

        ExpenseResponse response = new ExpenseResponse();

        response.setId(expense.getId());
        response.setExpenseNumber(expense.getExpenseNumber());
        response.setExpenseName(expense.getExpenseName());
        response.setExpenseDate(expense.getExpenseDate());
        response.setCategory(expense.getCategory());
        response.setVendor(expense.getVendor());
        response.setDescription(expense.getDescription());
        response.setAmount(expense.getAmount());
        response.setGstAmount(expense.getGstAmount());
        response.setPaymentMethod(expense.getPaymentMethod());
        response.setStatus(expense.getStatus());
        response.setCreatedAt(expense.getCreatedAt());

        return response;
    }
}