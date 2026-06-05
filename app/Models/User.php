<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'password_set_at', 'role', 'email_verified_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_set_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function hasPasswordSet(): bool
    {
        return $this->password_set_at !== null;
    }

    public function isStaffRole(): bool
    {
        return in_array((string) $this->role, ['admin', 'expert'], true);
    }

    /** Guest access-request flow applies only to regular user accounts. */
    public function usesAccessRequestActivation(): bool
    {
        return ! $this->isStaffRole();
    }

    public function expertProfile(): HasOne
    {
        return $this->hasOne(Expert::class, 'user_id');
    }

    public function accessRequest(): HasOne
    {
        return $this->hasOne(AccessRequest::class);
    }
}
