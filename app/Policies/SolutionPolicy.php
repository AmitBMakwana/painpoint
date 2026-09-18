<?php

namespace App\Policies;

use App\Models\User;

class SolutionPolicy
{
    /**
     * Determine whether the user can update the solution.
     */
    public function update(User $user, $solution): bool
    {
        return $user->id === (is_array($solution) ? $solution['author_id'] : $solution->author_id)
            || $user->role === 'Admin';
    }

    /**
     * Determine whether the user can delete the solution.
     */
    public function delete(User $user, $solution): bool
    {
        return $user->id === (is_array($solution) ? $solution['author_id'] : $solution->author_id)
            || $user->role === 'Admin';
    }
}
