<?php

namespace App\Mail;

use App\Models\TililaContestParticipant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TililaParticipationReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public TililaContestParticipant $participant) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Accusé de réception — Tilila Awards',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.tilila-participation-receipt',
        );
    }
}
