<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PhotosArticles;

class PhotosController extends Controller
{


    /**
     * Recupere une photo d'un article
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function getPhotos($id) {
        $photos = PhotosArticles::where('articleId', $id)->get();
        if(count($photos) > 0){
            return $photos;
        }else {
            return json_encode(array (
                "status"=>false,
                "message"=> "Aucunes photos trouvé"
            ));
        }
    }


    /**
     * supprime une photo d'un article
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la categorie 
     * 
     * @return desc return json status + message
    **/
    public function deletePhotos($id) {
        $delete_photos = PhotosArticles::find($id);
        if($delete_photos){

            $delete_photos->delete();

            if($delete_photos) {
                return json_encode(array(
                    "status"=>true,
                    "message"=>"Photos supprimé",
                ));
            }
            else {
                return json_encode(array(
                    "status"=>false,
                    "message"=>"Une erreur est survenu",
                ));
            }
        }
        else {
            return json_encode(array(
                "status"=>false,
                "message"=>"Une erreur est survenu",
            ));
        }
    }


    /**
     * Creer une photo d'un article
     * 
     * @author Cedric
     * @version V1.1
     * 
     * @params id type number, id de la categorie 
     * @params photos type file
     * 
     * @return desc return json status + message
    **/
    public function addPhotos($id, Request $request){
        $articleId = $id;

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
                "message"=>"photos publies",
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
}
