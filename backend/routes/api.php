<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Models\User;

/**
 * Login route
 */
Route::post('/login', [UserController::class, 'login']);

/**
 * Register route
 */
Route::post('/register', [UserController::class, 'register']);

/**
 * Protected routes (requires authentication)
 */
Route::middleware('auth:sanctum')->group(function () {
    /**
     * Create XSRF token - only available to authenticated users
     */
    Route::post('/csrf-token', [UserController::class, 'createToken']);
    
    /**
     * Logout route
     */
    Route::post('/logout', [UserController::class, 'logout']);

    /**
     * Get authenticated user details
     */
    Route::get('/user', [UserController::class, 'me']);

    /**
     * Transaction routes
     */
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
    Route::get('/transactions/summary/monthly', [TransactionController::class, 'monthlySummary']);
});


