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
        try{
        $filters = $request->validated();
        $transactions = $this->transactionService->listForUser($request->user(), $filters);
        return TransactionResource::collection($transactions);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch transactions', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created transaction
     * POST /api/transactions
     */
    public function store(TransactionRequest $request)
    {
        try {
        $data = $request->validated();
        $transaction = $this->transactionService->createForUser($request->user(), $data);
        return new TransactionResource($transaction);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create transaction', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a specific transaction
     * GET /api/transactions/{id}
     */
    public function show(Request $request, int $id)
    {
        try{
            $transaction = $this->transactionService->findForUser($request->user(), $id);
            return new TransactionResource($transaction);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Transaction not found', 'message' => $e->getMessage()], 404);
        }
    }

    /**
     * Update a specific transaction
     * PUT /api/transactions/{id}
     */
    public function update(TransactionRequest $request, int $id)
    {
        try{
        $data = $request->validated();
        $transaction = $this->transactionService->updateForUser($request->user(), $id, $data);
        return new TransactionResource($transaction);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update transaction', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a specific transaction
     * DELETE /api/transactions/{id}
     */
    public function destroy(Request $request, int $id)
    {
        try{
        $this->transactionService->deleteTransaction($request->user(), $id);
        return response()->json(['message' => 'Transaction deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete transaction', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get monthly summaries
     * GET /api/transactions/summary/monthly
     */
    public function monthlySummary(Request $request)
    {
        try{
        $monthsBack = $request->input('months', 6);
        $summary = $this->transactionService->sumByMonth($request->user(), $monthsBack);
        return response()->json(['data' => $summary], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch monthly summary', 'message' => $e->getMessage()], 500);
    
        }    
    }
}

