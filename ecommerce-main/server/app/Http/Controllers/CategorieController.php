<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Models\PhotosCategorie;

class CategorieController extends Controller
{
    /**
     * Creer une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params name type text: nom de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function addCategorie(Request $request)
    {
        $name = $request->input("name");
        $categorie_name = $request->input("categorie_name");
        if(!$categorie_name) {

        try {
            $new_Categorie = Categorie::create([
                'name' => $name,
            ]);
            if($new_Categorie->incrementing == 1) {
                $result = array(
                    "status"=>true,
                    "message"=>"Categorie crée sous le nom ".$name
                 );
                return json_encode($result);
                return json_encode($result);
            }
        } catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message"=>"Le nom existe déja",
             );
            return json_encode($result);
        }
    }
    else {
        try {
            $new_Categorie = Categorie::create([
                'name' => $name,
                'categorie_name' => $categorie_name,
            ]);
            if($new_Categorie->incrementing == 1) {
                $result = array(
                    "status"=>true,
                    "message"=>"Categorie crée sous le nom ".$name
                 );
                return json_encode($result);
            }
        } catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message"=>"Le nom existe déja",
             );
            return json_encode($result);
        }
    }

    }

    /**
     * Met a jour une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id_categorie type number, id de la categorie 
     * @params new_name type text: le nouveau nom de la categorie
     * @params new_categorie_name: creer une sous categorie
     * 
     * @return desc return json status + message
    **/
    public function updateNameCategorie(Request $request) {
        $id_Categorie = $request->input('idCategorie');
        $new_name = $request->input('newName');
        $new_categorie_name = $request->input("categorieName");
        $result = array(
            "status"=>false,
            "message" => "Une erreur est survenu lors de l'update du nom de Categorie"
        );
        try{
            $Categorie = Categorie::find($id_Categorie)->Collection->toArray();
            $categorie_name = Categorie::find($id_Categorie)->categorie_name;
            $name = Categorie::find($id_Categorie)->name;
            if ($new_categorie_name == $categorie_name && $new_name == $name) {
                $result = array(
                    "status"=>false,
                    "message" => "Veuillez changer au moins une information",
                );
                return json_encode($result);
            }
            if($new_categorie_name !== $categorie_name && $new_name !== $name) {
                $categorie_name = $new_categorie_name;
            }
            else if ($new_categorie_name !== $categorie_name && $new_name == $name) {
                $update_categorie = Categorie::find($id_Categorie);
                $update_categorie->categorie_name = $new_categorie_name;
                $update_categorie->save();

                $result = array(
                    "status"=>true,
                    "message" => "Categorie name mis a jour",
                );
                return json_encode($result);

            }
            
            $first_result = $this->createCategorie($new_name, $categorie_name);
            if($first_result) {
                $second_result = $this->updateCollectionCategorieName($Categorie, $new_name);
                if($second_result){
                    $dernier_result = $this->deleteCategorie($id_Categorie);
                    if($dernier_result) {
                        $result = array(
                            "status"=>true,
                            "message" => "CategorieName et CollectionCategorieName mis a jour",
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
     * Supprime une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function deleteCategorie($id_Categorie){
        try {
            $Categoriev2 = Categorie::find($id_Categorie);
            $Categoriev2->delete();

            return true;
        }
        catch (\Exception $e) {
            return false;
        }

    }

    

    /**
     * Supprime une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function deleteTheCategorie($id){
        try {
            $Categoriev2 = Categorie::find($id);
            $Categoriev2->delete();
            $result = array(
                "status"=>true,
                "message" => "CategorieName, Collections, articles et photos suprimé",
            );
            return json_encode($result);
        }
        catch (\Exception $e) {
            $result = array(
                "status"=>false,
                "message" => "Erreur lros de la suppression de la Categorie",
            );
            return json_encode($result);
        }

    }


    /**
     * Met a jour toutes les collection liés a une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params categorie tableau qui contient les categorie
     * @params new_name type text: nouveau nom categorie
     * 
     * @return desc return json status + message
    **/    
    public function updateCollectionCategorieName($Categorie, $new_name) {
        try{ 
            for ($i=0; $i < count($Categorie) ; $i++) { 
                $id = $Categorie[$i]['id'];

                $update_Collection_name = Collection::find($id);
                $update_Collection_name->Categorie_name = $new_name;
                $update_Collection_name->save();
            }
            return true;
        }
        catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Creer une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params new_name type text: nom de la categorie 
     * @params categorie_name type text: nom de la categorie
     * 
     * @return desc return json status + message
    **/
    public function createCategorie($new_name, $categorie_name) {
        if($categorie_name){

        }
        else {
            try {
                $new_Categorie = Categorie::create([
                    'name' => $new_name,
                    'categorie_name' => $categorie_name
                ]);
    
                return true;
            }
            catch (\Exception $e) {
                return false;
            }
        }
        try {
            $new_Categorie = Categorie::create([
                'name' => $new_name,
            ]);

            return true;
        }
        catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Recupere une categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number: id de la categorie
     * 
     * @return desc return json status + message
    **/
    public function getCategorieId($id,Request $request) {
         
        return Categorie::find($id);    
    }


    /**
     * Recupere toutes les categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * 
     * @return desc return json status + message
    **/
    public function getAllCategorie(){
        $categories = Categorie::all();

        foreach ($categories as $key => $value) {

            $photo = $this->getthephoto($value->id);
            
            if(count($photo) > 0){
                $value['urlPhoto'] = $photo[0]['urlPhoto'];
            }
        }
        return $categories;

    }



    /**
     * Recupere toutes les collections dune categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number: id de la categorie
     * 
     * @return desc return json status + message
    **/
    public function getAllCollectionByCategorie($id,Request $request) {
        try {
            $Categorie = Categorie::find($id)->collection;
            return $Categorie;
        }
        catch (\Exception $e) {
            return json_encode(array(
                "status:"=> false,
                "message"=>"Erreur l'ors de la recuperation de la collection (possible null)"
            ));
        }

    }


    /**
     * Recupere les photos de la categorie
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number: id de la categorie
     * 
     * @return desc return json status + message
    **/
    public function getthephoto($id){
        $photo =  PhotosCategorie::where('categorieId', $id)->get()->toArray();
        return $photo;
    }
}
