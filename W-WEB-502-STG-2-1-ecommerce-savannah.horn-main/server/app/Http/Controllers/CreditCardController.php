<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CreditCard;

class CreditCardController extends Controller
{
	/**
	 * Récupère toutes les cartes de l'utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response contenant les cartes
	**/
	public function getUserCards (Request $request) {
		$list = CreditCard::select('id','number','owner', 'date')->where('user_id', $request->user()->id)->get();

		foreach ($list as $key => $card) {
			$card->number = substr_replace($card->number,"XXXXXXXXX",6);
		}

		return $list;
	}

	/**
	 * Ajoute une carte
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response
	**/
	public function add_new_card (Request $request) {
		if($request->input('Number') && $request->input('Owner') && $request->input('Date')) {
			try{
				CreditCard::create([
					'number' => $request->input('Number'),
					'owner' => $request->input('Owner'),
					'date' => $request->input('Date'),
					'user_id' => $request->user()->id
				]);
			}
			catch  (Exception $e) {
				return response()->json([
					'status' => false,
					'message'=> "Une erreur est survenu"
            	], 500);
			}
			return response()->json([
				'status' => true,
			], 200);
			
        }
	}

	/**
	 * Supprime une carte
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response contenant les cartes
	**/
	public function delete_card(Request $request) {
		if($request->input('card_id')){
			try {
				$card = CreditCard::find($request->input('card_id'));
				if($card) {
					$card->delete();
				}
			}
			catch  (Exception $e) {
				return response()->json([
					'status' => false,
					'message'=> "Une erreur est survenu"
            	], 500);
			}
			return response()->json([
				'status' => true,
				'message' => "card supprimé"
			], 200);
		}
	}

	/**
	 * Récupère toutes les cartes de l'utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @param id ID de la carte
	 * 
	 * @return Response contenant les cartes
	**/
	public function get_the_card($id) {
		try {
			$card = CreditCard::find($id);
			if($card) {
				return response()->json([
					'status' => true,
					'data' => $card
				], 200);
			}
		}
		catch  (Exception $e) {
			return response()->json([
				'status' => false,
				'message'=> "Une erreur est survenu"
			], 500);
		}
	}

	/**
	 * Récupère toutes les cartes de l'utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @param id ID de la carte
	 * 
	 * @return Data de la carte mise a jour
	**/
	public function update_the_card(Request $request, $id){
		
		try{
			$card = CreditCard::find($id);
		if ($card) {
			if($request['data']['owner']) {
				$card->owner = $request['data']['owner'];
			}
			if($request['data']['number']) {
				$card->number = $request['data']['number'];
			}
			if($request['data']['date']) {
				$card->date = $request['data']['date'];
			}
			$card->save();
		}
		}
		catch  (Exception $e) {
			return $e;
			return response()->json([
				'status' => false,
				'message'=> "Une erreur est survenu"
			], 500);
		}
			return response()->json([
				'status' => true,
				'data'=> $card
			], 200);
	}
}
