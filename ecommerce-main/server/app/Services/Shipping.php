<?php

namespace App\Services;

use Shippo;
use Shippo_Address;
use Shippo_Shipment;

class Shipping {
    public function __construct()
    {
        // Grab this private key from
        // .env and setup the Shippo api
        Shippo::setApiKey(env('SHIPPO_PRIVATE'));
    }

    public function getFromAddress(){
        return Shippo_Address::create( array(
            "name" => "Adrian Wahler",
            "company" => "WebFourYou",
            "street1" => "215 Clayton St.",
            "city" => "San Francisco",
            "state" => "CA",
            "zip" => "94117",
            "country" => "US",
            "email" => "adrian.wahler@gmail.com",
            "validate" => true
        ));
    }

    /**
     * Validate an address through Shippo service
     *
     * @param User $user
     * @return Shippo_Adress
     */
    public function validateAddress(User $user)
    {
        // Grab the shipping address from the User model
        $toAddress = $user->shippingAddress();    // Pass a validate flag to Shippo
        $toAddress['validate'] = true;    // Verify the address data
        return Shippo_Address::create($toAddress);
    }

    /**
 * Create a Shippo shipping rates
 *
 * @param User $user
 * @param Product $product
 * @return Shippo_Shipment
 */
public function rates(Request $request)
{
    // Grab the shipping address from the User model
    $toAddress = Shippo_Address::create( array(
        "name" => "Adrian Wahler",
        "street1" => "32 Rue du Fossée Riepberg",
        "city" => "Strasbourg",
        "state" => "",
        "zip" => " 671000",
        "country" => "FR",
        "phone" => "+33786313008",
        "email" => "adrian.wahler@gmail.com"
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
        "validate" => true
    ));

    $parcel = array(
        'length'=> '20',
        'width'=> '20',
        'height'=> '20',
        'distance_unit'=> 'cm',
        'weight'=> '2',
        'mass_unit'=> 'kg',
    );

    return Shippo_Shipment::create([
            'address_from'=> $fromAddress,
            'address_to'=> $toAddress,
            'parcels'=> array($parcel),
            'async'=> false
    ])->rates;
}
}