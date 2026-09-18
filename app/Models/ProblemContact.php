<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProblemContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'problem_id',
        'name',
        'mobile',
        'email',
        'address',
        'city',
        'postal_code',
        'additional_info',
    ];

    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
