<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Contracts\TransactionServiceInterface;
use App\Models\Transaction;
use App\Models\User;
use App\Http\Requests\TransactionFilterRequest;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;

class TransactionController extends Controller
{
    public function __construct(private TransactionServiceInterface $transactionService)
    {
    }

    /**
     * List transactions for the authenticated user
     * GET /api/transactions
     */
    public function index(TransactionFilterRequest $request)
    {
        $filters = $request->validated();
        $transactions = $this->transactionService->listForUser($request->user(), $filters);
        return TransactionResource::collection($transactions);
    }

    /**
     * Store a newly created transaction
     * POST /api/transactions
     */
    public function store(TransactionRequest $request)
    {
        $data = $request->validated();
        $transaction = $this->transactionService->createForUser($request->user(), $data);
        return new TransactionResource($transaction);
    }

    /**
     * Get a specific transaction
     * GET /api/transactions/{id}
     */
    public function show(Request $request, int $id)
    {
        $transaction = $this->transactionService->findForUser($request->user(), $id);
        return new TransactionResource($transaction);
    }

    /**
     * Update a specific transaction
     * PUT /api/transactions/{id}
     */
    public function update(TransactionRequest $request, int $id)
    {
        $data = $request->validated();
        $transaction = $this->transactionService->updateForUser($request->user(), $id, $data);
        return new TransactionResource($transaction);
    }

    /**
     * Delete a specific transaction
     * DELETE /api/transactions/{id}
     */
    public function destroy(Request $request, int $id)
    {
        $this->transactionService->deleteTransaction($request->user(), $id);
        return response()->json(['message' => 'Transaction deleted successfully'], 200);
    }

    /**
     * Get monthly summaries
     * GET /api/transactions/summary/monthly
     */
    public function monthlySummary(Request $request)
    {
        $monthsBack = $request->input('months', 6);
        $summary = $this->transactionService->sumByMonth($request->user(), $monthsBack);
        return response()->json(['data' => $summary], 200);
    }
}

