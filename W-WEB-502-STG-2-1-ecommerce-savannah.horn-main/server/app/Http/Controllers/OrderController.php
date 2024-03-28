<?php

namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\User;
use App\Models\OrderContent;
use App\Models\Articles;
use App\Models\Address;
use App\Models\CreditCard;
use Laravel\Sanctum\PersonalAccessToken;

use Illuminate\Http\Request;
use Shippo_Transaction;
use Shippo;

class OrderController extends Controller
{

    /**
	 * Récupère une order
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @param id ID de l'order
	 * 
	 * @return Data de l'order
	**/
    function getOrder($id){
        return Order::find($id);
    }

    /**
	 * Récupère touts les orders de l'utilisateurs
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response contenant les cartes
	**/
    function getUserOrders(Request $request){
        return Order::where('user_id', $request->user()->id)->get();
    }

    /**
	 * Créé un order
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * 
	 * @return Transaction Shippo
	**/
    function createOrder(Request $request){

        Shippo::setApiKey(env('SHIPPO_PRIVATE'));
        $rate = json_decode($request->rate);
        $orderContent = json_decode($request["orderContent"]);
        $userId = $request->user()->id;
        $priceTotal = 0;

        foreach ($orderContent as $key => $orderDetails) {
            $article = Articles::where('id', $orderDetails->itemId)
                ->first();

            if ($orderDetails->quantity >= 100) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.95;
            } else if ($orderDetails->quantity >= 500) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.90;
            } else if ($orderDetails->quantity >= 1000) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.80;
            } else {
                $priceTotal = $article->prix * $orderDetails->quantity;
            }
        }   


        $transaction = Shippo_Transaction::create(array( 
            'rate' => $rate->object_id, 
            'label_file_type' => "PDF", 
            'async' => false));

        if ($transaction["status"] != "SUCCESS"){
            return( $transaction );
        }

        $orderId = Order::create([
            'user_id' => $userId,
            'price_total' => $priceTotal,
            'paid_status' => true,
            'delivery_status' => "processing",
            'tracking_number' => $transaction["tracking_number"]
        ])->id;

        foreach ($orderContent as $key => $article) {
            OrderContent::create([
                'article_id' => $article->itemId,
                'quantity' => $article->quantity,
                'order_id' => $orderId,
            ])->id;
        }

        if (!$request->addressAutoCompleted) {
            Address::create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'address' => $request->address,
                'city' => $request->city,
                'zipcode' => $request->zipcode,
                'country' => $request->country,
                'phone' => $request->phone,
                'user_id' => $userId,
            ]);
        }
        //On met les données utilisateur à jour 
        if ($request->creditCardId == null) {
            CreditCard::create([
                'number' => $request->cardNumber,
                'owner' => $request->cardOwner,
                'date' => $request->cardDate,
                'user_id' => $userId
            ]);
        }
        
        return( $transaction );

    }

    /**
	 * Créé un order pour les invités
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Transaction Shippo
	**/
    function createGuestOrder (Request $request) {

        Shippo::setApiKey(env('SHIPPO_PRIVATE'));
        $rate = json_decode($request->rate);
        $orderContent = json_decode($request["orderContent"]);
        $lastName = $request["lastName"];

        $priceTotal = 0;

        foreach ($orderContent as $key => $orderDetails) {
            $article = Articles::where('id', $orderDetails->itemId)
                ->first();

            if ($orderDetails->quantity >= 100) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.95;
            } else if ($orderDetails->quantity >= 500) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.90;
            } else if ($orderDetails->quantity >= 1000) {
                $priceTotal = $article->prix * $orderDetails->quantity * 0.80;
            } else {
                $priceTotal = $article->prix * $orderDetails->quantity;
            }
        }   

        $transaction = Shippo_Transaction::create( array( 
            'rate' => $rate->object_id,
            'label_file_type' => "PDF", 
            'async' => false ) );

        if ($transaction["status"] != "SUCCESS"){
            return( $transaction );
        }

        $orderId = Order::create([
            'price_total' => $priceTotal,
            'paid_status' => true,
            'delivery_status' => "processing",
            'guest_first_name' => $request["firstName"],
            'guest_last_name' => $request["lastName"],
            'guest_address' => $request["address"],
            'tracking_number' => $transaction["tracking_number"]
        ])->id;

        foreach ($orderContent as $key => $article) {
            OrderContent::create([
                'article_id' => $article->itemId,
                'quantity' => $article->quantity,
                'order_id' => $orderId,
            ])->id;
        }

        return( $transaction );
    }
}
