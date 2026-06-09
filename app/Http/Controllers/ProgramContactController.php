<?php

namespace App\Http\Controllers;

use App\Models\ProgramContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProgramContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'program' => ['nullable', 'string', 'in:tilila,tililab'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'locale' => ['nullable', 'string', 'max:8'],
        ]);

        ProgramContactMessage::query()->create([
            ...$data,
            'ip' => $request->ip(),
        ]);

        return back()->with('success', 'Your message has been sent.');
    }
}
