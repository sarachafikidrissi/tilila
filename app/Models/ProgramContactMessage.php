<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramContactMessage extends Model
{
    protected $fillable = [
        'program',
        'name',
        'email',
        'subject',
        'message',
        'locale',
        'ip',
    ];
}
