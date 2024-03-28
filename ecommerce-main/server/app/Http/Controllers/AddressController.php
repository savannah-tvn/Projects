<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Address;

class AddressController extends Controller
{   
	/**
	 * Récupère toutes les addresses d'un utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response
	**/
	public function getUserAddresses (Request $request) {
		return Address::where('user_id', $request->user()->id)->get();
	}

	/**
	 * Ajoute une nouvelle adresse a l'utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response
	**/
	public function add_new_adress(Request $request) {
		try{

			Address::create([
				'first_name' => $request->first_name,
				'last_name' => $request->last_name,
				'address' => $request->adress,
				'city' => $request->city,
				'zipcode' => $request->zipcode,
				'country' => $request->country,
				'phone' => $request->phone,
				'user_id' => $request->user()->id,
			]);
		}
		catch  (Exception $e) {
			return $e;
		}
		return response()->json([
			'status' => true,
			'message' => "Adress ajouté"
		], 200);
	}

	/**
	 * Supprime une adresse
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response
	**/
	public function delete_adress(Request $request) {
		if($request->input('adress_id')){
			try {
				$adress = Address::find($request->input('adress_id'));
				if($adress) {
					$adress->delete();
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
				'message' => "adress supprimé"
			], 200);
		}
	}

	/**
	 * Supprime une adresse
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @params id ID de l'utilisateur integer
	 * 
	 * @return User Data
	**/
	public function get_the_adress($id) {
		try {
			$adress = Address::find($id);
			if($adress) {
				return response()->json([
					'status' => true,
					'data' => $adress
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
	 * Supprime une adresse
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @params id ID de l'utilisateur integer
	 * 
	 * @return L'adresse updatée
	**/
	public function update_the_address(Request $request, $id){
		
		try{
			$adress = Address::find($id);
		if ($adress) {
			if($request['data']['country']) {
				$adress->country = $request['data']['country'];
			}
			if($request['data']['city']) {
				$adress->city = $request['data']['city'];
			}
			if($request['data']['zipcode']) {
				$adress->zipcode = $request['data']['zipcode'];
			}
			if($request['data']['phone']) {
				$adress->phone = $request['data']['phone'];
			}
			if($request['data']['address']) {
				$adress->address = $request['data']['address'];
			}
			if($request['data']['last_name']) {
				$adress->last_name = $request['data']['last_name'];
			}
			if($request['data']['first_name']) {
				$adress->first_name = $request['data']['first_name'];
			}
			$adress->save();
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
				'data'=> $adress
			], 200);
	}
}
