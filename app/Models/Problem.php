<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Problem extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'slug',
        'language_code',
        'category_slug',
        'category_name',
        'title',
        'description',
        'voice_transcript',
        'voice_recording_url',
        'country',
        'state',
        'city',
        'locality',
        'postal_code',
        'affected_group',
        'scale',
        'frequency',
        'urgency',
        'status',
        'submission_type',
        'user_id',
        'support_count',
        'contribution_count',
        'comment_count',
        'views_count',
        'is_pinned',
        'pin_order',
        'is_featured',
        'rejection_reason',
        'admin_notes',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'is_featured' => 'boolean',
            'support_count' => 'integer',
            'contribution_count' => 'integer',
            'comment_count' => 'integer',
            'views_count' => 'integer',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): HasOne
    {
        return $this->hasOne(ProblemContact::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ProblemMedia::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(ProblemLink::class);
    }

    public function supports(): HasMany
    {
        return $this->hasMany(Support::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(Contribution::class);
    }
}
