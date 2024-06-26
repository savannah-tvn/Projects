<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MessageGoogle extends Mailable
{
    use Queueable, SerializesModels;

    public $data; // Données pour la vue

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->from("wilo.ahadi@gmail.com") // L'expéditeur
                    ->subject("Message via le SMTP Google") // Le sujet
                    ->view('emails.message-google', [$this->data]); // La vue
    }
}