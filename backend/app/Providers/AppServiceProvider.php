<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\TransactionService;
use App\Services\Contracts\TransactionServiceInterface;
use Illuminate\Container\Attributes\Singleton;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TransactionServiceInterface::class, function ($app) {
            return new TransactionService();
        });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
