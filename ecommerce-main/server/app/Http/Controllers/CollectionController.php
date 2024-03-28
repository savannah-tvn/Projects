<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Articles;
use Illuminate\Http\Request;

class CollectionController extends Controller
{   
    /**
     * Creer une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params name type text: nom de la collection
     * @params categorie_name type text: nom de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function addCollection(Request $request)
    {
        $name = $request->input("name");
        $categorie_name = $request->input("categorieName");


        try {
            $new_collection = Collection::create([
                'name' => $name,
                'categorie_name' => $categorie_name,
            ]);
            if($new_collection->incrementing == 1) {
                $result = array(
                    "status"=>true,
                    "message"=>"collection cree sous le nom ".$name
                 );
                return json_encode($result);
            }
        } catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message"=>"Erreur l'ors de la creation de la collection",
             );
            return json_encode($result);
        }

    }
    


    /**
     * Recupere toutes les collections
     * 
     * @author Cedric
     * @version V1.1
     * 
     * 
     * @return desc return json status + message
    **/
    public function getAllCollection(){

        $collections = Collection::all();

        return $collections;
    }


    /**
     * Mets a jour la collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id_collection type number: id de la collection
     * @params new_name type text: nouveau nom de la collection
     * @params new_categorie_name type text: nouveau nom de la categorie
     * 
     * @return desc return json status + message
    **/
    public function updateNameCollection(Request $request) {
        $id_collection = $request->input('idCollection');
        $new_name = $request->input('newName');
        $new_categorie_name = $request->input("categorieName");
        $result = array(
            "status"=>false,
            "message" => "Une erreur est survenu lors de l'update du nom de collection"
        );
        try{
            $collection = Collection::find($id_collection)->articles->toArray();
            $categorie_name = Collection::find($id_collection)->categorie_name;
            $name = Collection::find($id_collection)->name;

            if($new_categorie_name !== $categorie_name && $new_name !== $name) {
                $categorie_name = $new_categorie_name;
            }
            else if ($new_categorie_name !== $categorie_name && $new_name == $name) {
                $update_collection = Collection::find($id_collection);
                $update_collection->categorie_name = $new_categorie_name;
                $update_collection->save();

                $result = array(
                    "status"=>true,
                    "message" => "Categorie name mis a jour",
                );
                return json_encode($result);

            }

            $check_collection_exist = Collection::where('name', $new_name)->get()->toArray();
            if(count($check_collection_exist) == 0) {
                $first_result = $this->createCollection($new_name, $categorie_name);
            }

            if($first_result) {
                $second_result = $this->updateArticleCollectionName($collection, $new_name);
                if($second_result){
                    $dernier_result = $this->deleteCollection($id_collection);
                    if($dernier_result) {
                        $result = array(
                            "status"=>true,
                            "message" => "CollectionName et articleCollectionName mis a jour",
                        );
                        return json_encode($result);
                    } else {
                        return json_encode($result);
                    }
                } else {
                    return json_encode($result);
                }
            } else {
                return json_encode($result);
            }
        }
        catch (\Exception $e) {
            return json_encode($result);
        }
    }


    /**
     * Supprime une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id_collection type number: id de la collection
     * 
     * @return desc return json status + message
    **/
    public function deleteCollection($id_collection){
        try {
            $collectionv2 = Collection::find($id_collection);
            $collectionv2->delete();

            return true;
        }
        catch (\Exception $e) {
            return false;
        }

    }


    /**
     * Supprime une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id_collection type number: id de la collection
     * 
     * @return desc return json status + message
    **/
    public function deleteTheCollection($id){
        try {
            $collectionv2 = Collection::find($id);
            $collectionv2->delete();
            $result = array(
                "status"=>true,
                "message" => "CollectionName, articles et photos suprimé",
            );
            return json_encode($result);
        }
        catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message" => "Erreur lros de la suppression de la collection",
            );
            return json_encode($result);
        }

    }


    /**
     * Mets a jour la collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id_collection type number: id de la collection
     * @params new_name type text: nouveau nom de la collection
     * @params new_categorie_name type text: nouveau nom de la categorie
     * 
     * @return desc return json status + message
    **/
    public function updateArticleCollectionName($collection, $new_name) {
        try{ 
            for ($i=0; $i < count($collection) ; $i++) { 
                $id = $collection[$i]['id'];

                $update_article_name = Articles::find($id);
                $update_article_name->collection_name = $new_name;
                $update_article_name->save();
            }
            return true;
        }
        catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Creer une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params new_name type text: nom de la collection
     * @params categorie_name type text: nom de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function createCollection($new_name, $categorie_name) {
        try {
            $new_collection = Collection::create([
                'name' => $new_name,
                'categorie_name' => $categorie_name,
            ]);

            return true;
        }
        catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Recupere une collection
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number: id de la collection
     * 
     * @return desc return json status + message
    **/
    public function getCollectionId($id){
        return Collection::find($id);
    }
}
