package MSME.MSME.Expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

    Optional<ExpenseEntity> findByExpenseNumber(String expenseNumber);

    boolean existsByExpenseNumber(String expenseNumber);

    List<ExpenseEntity> findByStatus(String status);

    List<ExpenseEntity> findTop5ByOrderByExpenseDateDesc();

    // ==============================
    // Dashboard / Accounts Queries
    // ==============================

    @Query("""
            SELECT COALESCE(SUM(e.amount),0)
            FROM ExpenseEntity e
            """)
    BigDecimal getTotalExpense();

    @Query("""
            SELECT COALESCE(SUM(e.gstAmount),0)
            FROM ExpenseEntity e
            """)
    BigDecimal getInputGST();

    @Query("""
            SELECT e
            FROM ExpenseEntity e
            ORDER BY e.expenseDate DESC
            """)
    List<ExpenseEntity> getAllExpenses();

    @Query("""
            SELECT e
            FROM ExpenseEntity e
            WHERE e.status='PAID'
            ORDER BY e.expenseDate DESC
            """)
    List<ExpenseEntity> getPaidExpenses();

    @Query("""
            SELECT e
            FROM ExpenseEntity e
            WHERE e.status='PENDING'
            ORDER BY e.expenseDate ASC
            """)
    List<ExpenseEntity> getPendingExpenses();

    @Query(value = """

            SELECT
TO_CHAR(expense_date,'Mon YYYY') AS month,
COALESCE(SUM(amount),0) AS total
FROM expenses
GROUP BY TO_CHAR(expense_date,'Mon YYYY'),
         DATE_TRUNC('month',expense_date)
ORDER BY DATE_TRUNC('month',expense_date)
""", nativeQuery = true)
    List<Object[]> getMonthlyExpenses();
    }