<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserController extends Controller
{
    /**
	 * Récupère tout les utilisateurs
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 *
	 * 
	 * @return Response Réponse qui contient tout les utilisateurs
	**/
    function getAllUser(){
        $all_user = User::all();
        return response()->json($all_user, 200);
    }

    /**
	 * Vérifie si un compte avec l'adresse donnée existe
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Boolean
	**/
    function emailExists(Request $request){
        try {
            $user = DB::table('users')->where('email',$request->email)->first();

            if ($user == null){
                return "false";
            } else {
                return "true";
            }
        } catch (\Throwable $th) {
            return response()->json([   
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
        
    }

    /**
	 * Récupère les données utilisateurs
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @param id ID de l'utilisateur
	 * 
	 * @return Response Contenant les données utilisateurs
	**/
    function getUser($id){
        $user = DB::table('users')->where('id',$id)->first();
        return response()->json($user, 200);
    }

    /**
	 * Récupère les données de l'utilisateurs qui a fait la requête
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response Données utilisateur
	**/
    function getCurrentUser(Request $request){
        return $request->user();
    }

    /**
	 * Update l'user
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @return Response Donnant le statut de l'update
	**/
    function updateUser(Request $request){

        $id = $request['id'];
        unset($request['id']);
        
        foreach ($_POST as $key => $value) {
            if (Schema::hasColumn('users', $key) && $key != 'role'){
                DB::table('users')
                ->where('id', $id)
                ->update([$key => $value]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'User ID '.$id.' Updated Successfully',
        ], 200);
    }

    /**
	 * Supprime un utilisateur
	 * 
	 * @author Adrian Wahler adrian.wahler@gmail.com
	 * @version V1
	 * 
	 * @param id ID de l'utilisateur a supprimer 
	 * 
	 * @return Response Statut de la suppression
	**/
    function deleteUser($id){

        $user = DB::table('users')->where('id',$id)->delete();

        return response()->json([
            'status' => true,
            'message' => 'User ID '.$id.' Deleted Successfully',
        ], 200);
    }
}
