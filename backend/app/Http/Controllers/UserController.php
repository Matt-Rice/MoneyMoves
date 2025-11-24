<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Models\Transaction;
use App\Services\Contracts\TransactionServiceInterface;

class UserController extends Controller
{
    public function __construct(private TransactionServiceInterface $transactionService)
    {
        $transactionService = $this->transactionService;
    }
    /**
     * Creates a XSRF token
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function createToken(Request $request)
    {
        $token = $request->user()->createToken('api-token');
        if (!isset($token->plainTextToken)) {
            return response()->json(['error' => 'Unable to create token'], 500);
        }

        return response()->json(['token' => $token->plainTextToken], 200);
    }

    /**
     * register a user
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!isset($request->email) || !isset($request->name) || !isset($request->password)) {
            return response()->json(['error' => 'Missing required fields'], 400);
        }

        // Check for duplicate
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User already exists'], 409);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        
        // Generate token for the newly created user
        $token = $user->createToken('api-token');

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token->plainTextToken,
            'user' => $user->only('id', 'name', 'email')
        ], 201);
    }

    /**
     * Login and return API token
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        request()->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!isset($request->email) || !isset($request->password)) {
            return response()->json(['error' => 'Missing required fields'], 400);
        }

        $credentials = $request->only('email', 'password');

        // find user
        $user = User::where('email', $credentials['email'])->first();

        if ($user && Hash::check($credentials['password'], $user->password)) {
            $token = $user->createToken('api-token');
            return response()->json([
                'token' => $token->plainTextToken,
                'user' => $user->only('id', 'name', 'email')
            ], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    //logout function
    public function logout(Request $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    /**
     * Get Authenticated User
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return response()->json($request->user()->only('id', 'name', 'email'));
    }
}
