<?php

namespace App\Policies;

use App\Models\User;

class ProblemPolicy
{
    /**
     * Determine whether the user can update the problem.
     */
    public function update(User $user, $problem): bool
    {
        return $user->id === (is_array($problem) ? $problem['author_id'] : $problem->author_id)
            || $user->role === 'Admin';
    }

    /**
     * Determine whether the user can delete the problem.
     */
    public function delete(User $user, $problem): bool
    {
        return $user->id === (is_array($problem) ? $problem['author_id'] : $problem->author_id)
            || $user->role === 'Admin';
    }
}
