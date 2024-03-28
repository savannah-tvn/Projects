<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PhotosController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ArticlesController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\PhotosCategorieController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CreditCardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


////////////////
//  Categorie (Documented)
/////////////////

// creer une categorie
Route::post("addCategorie", [CategorieController::class, 'addCategorie']);

// modifie nom categorie
Route::post("updateNameCategorie", [CategorieController::class, 'updateNameCategorie']);

// supprime une categorie, ses collections, ses articles et ses photos
Route::post("deleteCategorie/{id}", [CategorieController::class, 'deleteTheCategorie'])->where('id', '[0-9]+');

// recupere toutes les categories
Route::get('getAllCategorie', [CategorieController::class, 'getAllCategorie']);

// recupere une categorie
Route::get('getCategorieId/{id}', [CategorieController::class, 'getCategorieId'])->where('id', '[0-9]+');

/////////////////
//  Collection (Documenting)
//////////////////

// creer une collection
Route::post("addCollection", [CollectionController::class, 'addCollection']);

// modifie nom collection
Route::post("updateNameCollection", [CollectionController::class, 'updateNameCollection']);

//suprime une collection et ses articles et ses photos
Route::post("deleteCollection/{id}", [CollectionController::class, 'deleteTheCollection'])->where('id', '[0-9]+');

// recupere toutes les collections
Route::get("getAllCollection", [CollectionController::class, 'getAllCollection']);

// recupere une collection
Route::get('getCollectionId/{id}', [CollectionController::class, 'getCollectionId'])->where('id', '[0-9]+');

// recupere toutes les collections par rapport a l'id de la categorie
Route::get("getAllCollectionByCategorie/{id}", [CategorieController::class, 'getAllCollectionByCategorie'])->where('id', '[0-9]+');

///////////////////
//  Article
///////////////////

// creer un article
Route::post("addArticle",[ArticlesController::class,'addArticle']);

// creer un article avec fichier exel
Route::post("addArticleEx",[ArticlesController::class,'addArticleEx']);

//suprime un article
Route::post("deleteArticle/{id}", [ArticlesController::class, 'deleteArticle'])->where('id', '[0-9]+');

//modifie un article
Route::post("updateArticle", [ArticlesController::class, 'updateArticle']);

// recupere tous les articles
Route::get("getAllArticle", [ArticlesController::class, 'getAllArticle']);

// recupere un article
Route::get('getArticleId/{id}', [ArticlesController::class, 'getArticleId'])->where('id', '[0-9]+');

// recupere les article par rapport a l'id de la collection donnée
Route::get("getAllArticleByCollection/{id}", [ArticlesController::class, 'getAllArticleByCollection'])->where('id', '[0-9]+');

// envoi un mail
Route::get("message", [MessageController::class,"formMessageGoogle"]);
Route::post("message", [MessageController::class, "sendMessageGoogle"])->name('send.message.google');

///////////////////
//  photos
////////////////

// recupere les photos d'un article
Route::get("getPhotos/{id}", [PhotosController::class,'getPhotos'])->where('id', '[0-9]+');
// suprime une photo
Route::post("deletePhotos/{id}", [PhotosController::class,"deletePhotos"])->where('id', '[0-9]+');
// ajouter une photo
Route::post("addPhotos/{id}", [PhotosController::class,"addPhotos"])->where('id', '[0-9]+');

// recupere les photos d'une categorie
Route::get("getPhotosCategorie/{id}", [PhotosCategorieController::class,'getPhotos'])->where('id', '[0-9]+');
// suprime une photo
Route::post("deletePhotosCategorie/{id}", [PhotosCategorieController::class,"deletePhotos"])->where('id', '[0-9]+');
// ajouter une photo
Route::post("addPhotosCategorie/{id}", [PhotosCategorieController::class,"addPhotos"])->where('id', '[0-9]+');

///////////////////
//  User
////////////////

//Connexion/creation de compte
Route::post('/auth/register', [AuthController::class, 'createUser']);

//Log User In
Route::post('/auth/login', [AuthController::class, 'loginUser']);

//Log User In Via Google
Route::post('/auth/connectGoogleUser', [AuthController::class, 'connectGoogleUser']);

//Checks if user email exists
Route::post('/userEmailExists', [UserController::class, 'emailExists']);

//Logs User Out
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logoutUser']);

//Get All User Infos
Route::get('/user/{id}', [UserController::class, 'getUser']);

//Get Currently Logged In User Via Auth Token
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getCurrentUser']);

//Get All Infos Of All Users
Route::get('/getAllUser', [UserController::class, 'getAllUser']);

//Updates User Infos
Route::post('/updateUser', [UserController::class, 'updateUser']);

//Deletes User
Route::delete('/user/{id}', [UserController::class, 'deleteUser']);

///////////////////
//  Orders
////////////////

// Creates a new Order
Route::middleware('auth:sanctum')->post('/order/', [OrderController::class, 'createOrder']);

// Get All Orders From a User
Route::middleware('auth:sanctum')->get('/userOrders', [OrderController::class, 'getUserOrders']);

// Create an Order for a Guest
Route::post('/guestOrder/', [OrderController::class, 'createGuestOrder']);

// Get From Address
Route::get('/ship/from/', [ShippingController::class, 'getFromAddress']);

// Get Rates for a given Address
Route::post('/ship/rates/', [ShippingController::class, 'rates']);

///////////////////
//  Cards
////////////////

// Create a new card for user
Route::middleware('auth:sanctum')->post("/add_new_card", [CreditCardController::class, 'add_new_card']);

// Get All Cards for User
Route::middleware('auth:sanctum')->get("/get_card_user", [CreditCardController::class, 'getUserCards']);

// Delete a Card
Route::middleware('auth:sanctum')->post("/delete_card", [CreditCardController::class, 'delete_card']);

// Get card by ID
Route::middleware('auth:sanctum')->get("/get_the_card/{id}", [CreditCardController::class, 'get_the_card']);

// Update Given Card
Route::middleware('auth:sanctum')->post("/update_the_card/{id}", [CreditCardController::class, 'update_the_card']);

// Get All User Cards
Route::middleware('auth:sanctum')->get('/userCards', [CreditCardController::class, 'getUserCards']);

///////////////////
//  Address
////////////////

// Create New Address for User
Route::middleware('auth:sanctum')->post("/add_new_adress", [AddressController::class, 'add_new_adress']);

// Get all Addresses from User
Route::middleware('auth:sanctum')->get("/get_adress_user", [AddressController::class, 'getUserAddresses']);

// Delete User Address
Route::middleware('auth:sanctum')->post("/delete_adress", [AddressController::class, 'delete_adress']);

// Get Address by ID
Route::middleware('auth:sanctum')->get("/get_the_address/{id}", [AddressController::class, 'get_the_adress']);

// Update Address
Route::middleware('auth:sanctum')->post("/update_the_address/{id}", [AddressController::class, 'update_the_address']);

// Get All User Addresses
Route::middleware('auth:sanctum')->get('/userAddresses', [AddressController::class, 'getUserAddresses']);