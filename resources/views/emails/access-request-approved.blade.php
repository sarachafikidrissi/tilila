@extends('emails.layouts.base')

@section('title', 'Access activated')

@section('preheader')
    Your request to view expert profiles has been activated.
@endsection

@section('content')
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a;">
        Your access request is activated
    </h2>

    <p style="margin: 0 0 14px; color: #334155;">
        Hello {{ $accessRequest->user->name }},
    </p>
    <p style="margin: 0; color: #334155;">
        Your request to view expert profiles on Tilila has been activated. You can sign in to your account and browse expert profiles.
    </p>
@endsection
