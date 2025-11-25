<?php
namespace App\Services;

use App\Services\Contracts\TransactionServiceInterface;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Service that will handle any operations related to transactions
 */
class TransactionService implements TransactionServiceInterface
{
    /**
     * Creates a transaction for a user
     * @param User $user
     * @param array $data
     * @return Transaction
     */
    public function createForUser(User $user, array $data): Transaction{
        // Ensure required date is present (migration requires non-null date)
        if (empty($data['date'])) {
            $data['date'] = now()->toDateString();
        }

        return $user->transactions()->create($data);
    }

    /**
     * Finds a specified transaction for a user
     * @param User $user
     * @param int $transactionId
     * @return Transaction
     */
    public function findForUser(User $user, int $transactionId): Transaction {
        return $user->transactions()->findOrFail($transactionId);
    }

    /**
     * Updates specific transaction
     * @param User $user
     * @param int $transactionId
     * @param array $data
     * @return Transaction
     */
    public function updateForUser(User $user, int $transactionId, array $data): Transaction {
        $transaction = $this->findForUser($user, $transactionId);
        $transaction->update($data);
        return $transaction;
    }

    /**
     * Deletes a transaction by its ID for a specific user
     * @param User $user
     * @param int $transactionId
     */
    public function deleteForUser(User $user, int $transactionId): void {
        $transaction = $this->findForUser($user, $transactionId);
        $transaction->delete();
    }

    /**
     * Calculates the total transaction amount of a specified type
     * @param User $user
     * @param string $type
     * @return float total amount for that type
     */
    public function calculateTypeTotal(User $user, string $type): float
    {
        $transactions = $this->getTransactionsByType($user, $type);
        return array_reduce($transactions, fn($sum, $transaction) => $sum + $transaction['amount'], 0.0);
    }

    /**
     * Gets transactions by type
     * @param User $user
     * @param string $type
     * @return array
     */
    public function getTransactionsByType(User $user, string $type): array
    {
        return $user->transactions()
            ->where('type', $type)
            ->get()
            ->toArray();
    }

    /**
     * Calculates the total transaction amount of a specified category
     * @param User $user
     * @param string $category
     * @return float total amount for that type
     */
    public function calculateCategoryTotal(User $user, string $type): float
    {
        $transactions = $this->getTransactionsByCategory($user, $type);
        return array_reduce($transactions, fn($sum, $transaction) => $sum + $transaction['amount'], 0.0);
    }

    /**
     * Summary of getTransactionsByCategory
     * @param User $user
     * @param string $category
     * @return array
     */
    public function getTransactionsByCategory(User $user, string $category): array
    {
            return $user->transactions()
                ->where('category', $category)
                ->get()
                ->toArray();
    }

    /**
     * Lists transactions for a user with optional filters
     * @param User $user
     * @param array $filters
     * @return array
     */
public function listForUser(User $user, array $filters = []): LengthAwarePaginator
{
    $query = $user->transactions()->newQuery();

    if (!empty($filters['type'])) {
        $query->where('type', $filters['type']);
    }

    if (!empty($filters['category'])) {
        $query->where('category', $filters['category']);
    }

    if (!empty($filters['date_from'])) {
        $query->whereDate('created_at', '>=', $filters['date_from']);
    }

    if (!empty($filters['date_to'])) {
        $query->whereDate('created_at', '<=', $filters['date_to']);
    }

    if (!empty($filters['sort'])) {
        $direction = str_starts_with($filters['sort'], '-') ? 'desc' : 'asc';
        $column = ltrim($filters['sort'], '-');
        $query->orderBy($column, $direction);
    } else {
        $query->latest();
    }

    $perPage = $filters['per_page'] ?? 15;
    return $query->paginate(min($perPage, 100));
}

    /**
     * Deletes a transaction by its ID for a specific user
     * @param User $user
     * @param int $transactionId
     */
    public function deleteTransaction(User $user, int $transactionId): void
    {
        $transaction = $this->findForUser($user, $transactionId);
        $transaction->delete();
    }

    /**
     * Gets monthly totals for a user over the specified number of months
     * @param User $user
     * @param int $monthsBack
     * @return array
     */
    public function sumByMonth(User $user, int $monthsBack = 6): array
    {
        $transactions = $user->transactions()
            ->where('created_at', '>=', now()->subMonths($monthsBack))
            ->orderBy('created_at', 'desc')
            ->get();

        $monthlyTotals = [];
        foreach ($transactions as $tx) {
            $monthKey = $tx->created_at->format('Y-m');
            if (!isset($monthlyTotals[$monthKey])) {
                $monthlyTotals[$monthKey] = ['total' => 0, 'income' => 0, 'expense' => 0];
            }
            $monthlyTotals[$monthKey]['total'] += $tx->amount;
            if ($tx->type === 'income') {
                $monthlyTotals[$monthKey]['income'] += $tx->amount;
            } else {
                $monthlyTotals[$monthKey]['expense'] += $tx->amount;
            }
        }

        return $monthlyTotals;
    }
}