<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;


    /**
     * Primary key for the transactions table
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Fillable fields for a transaction
     */
    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'category',
        'date',
        'description'
    ];

    /**
     * Gets the user associated to this transaction
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, Transaction>
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    

}
