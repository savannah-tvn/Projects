<?php

namespace App\Http\Controllers;

use App\Models\Articles;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\PhotosArticles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ArticlesController extends Controller

{   /**
    * Fonction qui creer un article
    * 
    * @author Cedric
    * @version V1.1
    * 
    * @params photos type file: accepte une ou plusieurs photos
    * @params description type text: description de l'article
    * @params caracteristique type text: caracteristiques de l'article
    * @params prix type number: prix de l'article
    * @params poids type number: poids de l'article
    * @params couleur type text: couleur de l'article
    * @params promotion type number, peut etre null: promotion en pourcentage de l'article
    * @params stock_bobine type number, peut etre null: quantité bobine
    * @params stock_bande type number, peut etre null: quantité bande
    * @params stock_vrac type number, peut etre null: quantité vrac
    * 
    * @return desc return json status + message
   **/
    public function addArticle(Request $request) {
        $photos = $request->file("photos");
        $description = $request->input("description");
        $caracteristique = $request->input("caracteristique");
        $prix = $request->input("prix");
        $poids = $request->input("poids");
        $couleur = $request->input("couleur");
        $promotion = $request->input("promotion");
        $stock_bobine = $request->input("stock_bobine");
        $stock_bande = $request->input("stock_bande");
        $stock_vrac = $request->input("stock_vrac");

        

        $collection = $request->input("collection");

        if(!$promotion) {
            $promotion = null;
        };
        if(!$stock_bobine) {
            $stock_bobine = null;
        };
        if(!$stock_bande) {
            $stock_bande = null;
        };
        if(!$stock_vrac) {
            $stock_vrac = null;
        };
        if($description && $caracteristique && $prix && $poids && $couleur && $collection && $photos) {

                $article = Articles::create([
                    'description' => $description,
                    'caracteristique' => $caracteristique,
                    'collection_name'=>$collection,
                    'prix' => $prix,
                    'poids' => $poids,
                    'couleur' => $couleur,
                    'stock_bobine' => $stock_bobine,
                    'stock_bande' => $stock_bande,
                    'stock_vrac' => $stock_vrac,
                    'promotion' => $promotion,
                ]);

            if($article->wasRecentlyCreated == 1){
                $articleId = $article['id'];
               
                if ($request->hasFile('photos')) {
                    foreach ($request->file('photos') as $photo) {

                        if ($photo->isValid()) {
                            $name = $photo->getClientOriginalName();
                            $mime = $photo->getClientMimeType();
                            $size = $photo->getSize();
                            $path = $photo->store('photosArticle', 'public');

                            $photoArticle = PhotosArticles::create([
                                'articleId'=> $articleId,
                                'urlPhoto' => $path,
                            ]);
                        } else {
                            $result = array(
                                "status"=>false,
                                "message"=>"Erreur l'ors de l'upload des images",
                             );
                            return json_encode($result);
                        }
                    }
                    $result = array(
                        "status"=>true,
                        "message"=>"Article et photos publies",
                     );
                    return json_encode($result);
                } else {
                    $result = array(
                        "status"=>false,
                        "message"=>"Veuillez publier une image",
                     );
                    return json_encode($result);
                }
            }
             else {
                $result = array(
                    "status"=>false,
                    "message"=>"Erreur l'ors de la creation d'un article",
                 );
                return json_encode($result);
            };
            
        }else{
            $result = array(
                "status"=>false,
                "message"=>"Veuillez renseigner tous els champs",
             );
            return json_encode($result);
        };
    }



    /**
    * Fonction qui creer un article via l'import de fichier
    * 
    * @author Cedric
    * @version V1.1
    * 
    * @params description type text: description de l'article
    * @params caracteristique type text: caracteristiques de l'article
    * @params prix type number: prix de l'article
    * @params poids type number: poids de l'article
    * @params couleur type text: couleur de l'article
    * @params promotion type number, peut etre null: promotion en pourcentage de l'article
    * @params stock_bobine type number, peut etre null: quantité bobine
    * @params stock_bande type number, peut etre null: quantité bande
    * @params stock_vrac type number, peut etre null: quantité vrac
    * 
    * @return desc return json status + message
   **/
    public function addArticleEx(Request $request) {
        if($request->description && $request->caracteristique && $request->collection_name
            && $request->prix && $request->poids && $request->couleur) {
                if(!$request->promotion) {
                    $request->promotion = null;
                    $promotion = null;
                }
                else if ($request->promotion) {
                    $promotion = $request->promotion;
                }
                if(!$request->stock_bobine) {
                    $request->stock_bobine = null;
                    $stock_bobine = null;
                }
                else if ($request->stock_bobine) {
                    $stock_bobine = $request->stock_bobine;
                }
                if(!$request->stock_bande) {
                    $request->stock_bande = null;
                    $stock_bande = null;
                }
                else if ($request->stock_bande) {
                    $stock_bande = $request->stock_bande;
                }
                if(!$request->stock_vrac) {
                    $request->stock_vrac = null;
                    $stock_vrac = null;
                }
                else if ($request->stock_vrac) {
                    $stock_vrac = $request->stock_vrac;
                }
                try {
                    $article = Articles::create([
                        'description' => $request->description,
                        'caracteristique' => $request->caracteristique,
                        'collection_name'=> $request->collection_name,
                        'prix' => $request->prix,
                        'poids' => $request->poids,
                        'couleur' => $request->couleur,
                        'stock_bobine' => $stock_bobine,
                        'stock_bande' => $stock_bande,
                        'stock_vrac' => $stock_vrac,
                        'promotion' => $promotion,
                    ]);
                    return $result = array(
                        "status"=>true,
                        "message" => "L'article a bien été ajouté",
                    );
                    return json_encode($result);
                } catch (\Exception $e) {
                    return $e;
                }
            
            }
    }


    /**
     * Suppresion article
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de l'article 
     * 
     * @return desc return json status + message
    **/
    public function deleteArticle($id) {
        try {

            $delete_article = Articles::find($id)->delete();
            $result = array(
                "status"=>true,
                "message" => "L'article a bien été supprimé",
            );
            return json_encode($result);
        }
        catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message" => "Erreur lros de la suppression de l'article",
            );
            return json_encode($result);
        }
    }


    /**
     * Modifie un article en fonction des paramettres donnés
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params description type text: description de l'article
     * @params caracteristique type text: caracteristiques de l'article
     * @params prix type number: prix de l'article
     * @params poids type number: poids de l'article
     * @params couleur type text: couleur de l'article
     * @params promotion type number, peut etre null: promotion en pourcentage de l'article
     * @params stock_bobine type number, peut etre null: quantité bobine
     * @params stock_bande type number, peut etre null: quantité bande
     * @params stock_vrac type number, peut etre null: quantité vrac
     * 
     * @return desc return json status + message
    **/
    public function updateArticle(Request $request) {
        $id = $request['id'];
        unset($request['id']);
        $article = Articles::findOrFail($id);
        try {
            foreach ($request->all() as $key => $value) {
                if (Schema::hasColumn('articles', $key) && $key != 'id'){
                    DB::table('articles')
                    ->where('id', $id)
                    ->update([$key => $value]);
                }
            }
            $result = array(
                "status"=>true,
                "message" => "L'article a bien ete modifie",
            );
            return json_encode($result);
        }
        catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message" => "Erreur lros de la modification de l'article",
            );
            return json_encode($result);
        }
    }



    /**
     * Recupere un article via son id
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de l'article 
     * 
     * @return desc return json status + message
    **/
    public function getArticleId($id) {
        $result = array();
        $article = Articles::find($id);
        $photos = Articles::find($id)->photo;

        $result['article']=$article;
        $result['photos']=$photos;
        return $result;
    }



    /**
     * Recupere tous les articles
     * 
     * @author Cedric
     * @version V1.1
     *  
     * @return desc return json status + message
    **/
    public function getAllArticle(Request $request) {


        $articles = Articles::all();
        
        return $articles;
    }



    /**
     * Recupere tous les articles d'une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la collection 
     * 
     * @return desc return json status + message
    **/
    public function getAllArticleByCollection($id) {
        try {
            $collection_name = Collection::find($id)->name;
            
            $articles = Articles::where('collection_name', $collection_name)->get();

            foreach ($articles as $key => $value) {

                $photo = $this->getthephoto($value->id);
                if(count($photo) > 0){
                    $value['urlPhoto'] = $photo[0]['urlPhoto'];
                }
            }
            return $articles;
        }
        catch (\Exception $e) {
            return json_encode(array(
                "status:"=> false,
                "message"=>"Erreur l'ors de la recuperation de la collection (possible null)"
            ));
        }

    }
    public function getthephoto($id){
        $photo =  PhotosArticles::where('articleId', $id)->get()->toArray();
        return $photo;
    }
}