<?php 

namespace App\Services\Contracts;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Interface for transaction services
 */
interface TransactionServiceInterface
{

    /*
    Future
        bulk create, update, delete
        import and export CSV
        create and process recurring transactions
        soft delete and restore
        purging old transactions
    */

    /**
     * Creates a transaction for a user
     * @param User $user
     * @param array $data
     * @return void
     */
    public function createForUser(User $user, array $data): Transaction;

    /**
     * Calculates the total transaction amount of a specified type
     * @param User $user
     * @param string $type
     * @return float total amount for that type
     */
    public function calculateTypeTotal(User $user, string $type): float;

    /**
     * Gets transactions by type
     * @param User $user
     * @param string $type
     * @return array
     */
    public function getTransactionsByType(User $user, string $type): array;

    /**
     * Calculates the total transaction amount of a specified category
     * @param User $user
     * @param string $category
     * @return float total amount for that type
     */
    public function calculateCategoryTotal(User $user, string $type): float;

    /**
     * Summary of getTransactionsByCategory
     * @param User $user
     * @param string $category
     * @return array
     */
    public function getTransactionsByCategory(User $user, string $category): array;

    /**
     * Lists transactions for a user with optional filters
     * @param User $user
     * @param array $filters
     * @return array
     */
    public function listForUser(User $user, array $filters = []): LengthAwarePaginator;

    /**
     * Deletes a transaction by its ID for a specific user
     * @param User $user
     * @param int $transactionId
     */
    public function deleteTransaction(User $user, int $transactionId): void;

    /**
     * Finds a transaction by ID for a specific user
     * @param User $user
     * @param int $id
     * @return Transaction
     */
    public function findForUser(User $user, int $id): Transaction;

    /**
     * Updates a transaction for a specific user
     * @param User $user
     * @param int $id
     * @param array $data
     * @return Transaction
     */
    public function updateForUser(User $user, int $id, array $data): Transaction;

    /**
     * Gets monthly totals for a user
     * @param User $user
     * @param int $monthsBack
     * @return array
     */
    public function sumByMonth(User $user, int $monthsBack = 6): array;
}