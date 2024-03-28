<?php

namespace App\Http\Controllers;

use App\Services\Shipping;
use App\Models\Articles;
use Illuminate\Http\Request;
use Shippo;
use Shippo_Address;
use Shippo_Shipment;
use Shippo_CustomsDeclaration;

class ShippingController extends Controller
{
    /**
	 * Récupère l'addresse d'origine def l'expédition
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Addresse Shippo
	**/
    function getFromAddress(){
        $ship = new Shipping;
        return $ship->getFromAddress();
    }   

    /**
	 * Récumère les prix
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Rates
	**/
    function rates(Request $request){
        $ship = new Shipping;
        $cart = json_decode($request->cart);
        $totalWeight = 0;

        foreach ($cart as $key => $articleID) {
            $article = Articles::find($articleID->itemId);
            $totalWeight += $article->poids * $articleID->quantity;
        }

        $toAddress = Shippo_Address::create( array(
            "name" => $request->firstName." ".$request->lastName,
            "street1" => $request->address,
            "city" => $request->city,
            "zip" => $request->zipcode,
            "country" => $request->country,
            "phone" => $request->phone,
        ));

        $fromAddress = Shippo_Address::create( array(
            "name" => "Adrian Wahler",
            "company" => "WebFourYou",
            "street1" => "215 Clayton St.",
            "city" => "San Francisco",
            "state" => "CA",
            "zip" => "94117",
            "country" => "US",
            "email" => "adrian.wahler@gmail.com",
            "phone" => "+33786313008",
            "validate" => true
        ));

        $customs = Shippo_CustomsDeclaration::create([
            'certify' => true,
            'certify_signer' => 'Adrian',
            'contents_type' => 'MERCHANDISE',
            'contents_explanation' => "Electronics",
            'test' => TRUE,
            'items' => [[
                "description" => "Electronics",
                "mass_unit" => "g",
                "net_weight" => "0.1",
                "origin_country" => "US",
                "quantity" => 1,
                "value_amount" => "200",
                "value_currency" => "USD",
                "test" => true
            ]],
            'non_delivery_options' => 'RETURN'
        ]);
    
        $parcel = array(
            'length'=> '20',
            'width'=> '20',
            'height'=> '20',
            'distance_unit'=> 'cm',
            'weight'=> $totalWeight,
            'mass_unit'=> 'g',
            "customs_declaration" => "Electronics"
        );
    
        return Shippo_Shipment::create([
                'object_purpose'=> 'PURCHASE',
                'address_from'=> $fromAddress,
                'address_to'=> $toAddress,
                'parcels'=> array($parcel),
                'customs_declaration' => $customs,
                'async'=> false
        ]);
    }
    

}