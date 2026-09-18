<?php

namespace App\Policies;

use App\Models\User;

class CommentPolicy
{
    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, $comment): bool
    {
        return $user->id === (is_array($comment) ? $comment['author_id'] : $comment->author_id)
            || $user->role === 'Admin';
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, $comment): bool
    {
        return $user->id === (is_array($comment) ? $comment['author_id'] : $comment->author_id)
            || $user->role === 'Admin';
    }
}
