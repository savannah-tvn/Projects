<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//Importation des classes pour le mail
use App\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\MessageGoogle;

class MessageController extends Controller
{
	// Le formulaire du message
	public function formMessageGoogle () {
		return view("forms.message-google");
	}

    // Envoi du mail aux utilisateurs
	public function sendMessageGoogle (Request $request) {



		#2. Récupération des utilisateurs

		#3. Envoi du mail
        $data['email'] = $request->email;
        $data['message'] = $request->message;
        
        Mail::to($request->email)->bcc("wilo.ahadi@gmail.com")
            ->queue(new MessageGoogle($data));
        
        return back()->withText("Message envoyé");
	}

}
