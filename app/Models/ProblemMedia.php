<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProblemMedia extends Model
{
    use HasFactory;

    protected $table = 'problem_media';

    protected $fillable = [
        'problem_id',
        'type',
        'url',
        'file_name',
        'file_size',
        'mime_type',
        'title',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
