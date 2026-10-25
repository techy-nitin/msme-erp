package MSME.MSME.Expense;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // ==========================================
    // CREATE EXPENSE
    // ==========================================

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @RequestBody ExpenseRequest request) {

        return new ResponseEntity<>(
                expenseService.createExpense(request),
                HttpStatus.CREATED
        );
    }

    // ==========================================
    // GET ALL EXPENSES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {

        return ResponseEntity.ok(
                expenseService.getAllExpenses()
        );
    }

    // ==========================================
    // GET EXPENSE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpense(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.getExpense(id)
        );
    }

    // ==========================================
    // UPDATE EXPENSE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(id, request)
        );
    }

    // ==========================================
    // DELETE EXPENSE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.ok("Expense deleted successfully.");
    }

}