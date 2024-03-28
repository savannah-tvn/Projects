<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function createUser(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make($request->all(), 
            [
                'last_name' => 'required',
                'first_name' => 'required',
                'birth_date' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required',
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            //Chargement de la liste d'adresses admins
            $adminMailFile = fopen( resource_path() . '/adminusers.txt' , "r");
            $mailList = fread($adminMailFile,filesize(resource_path() . '/adminusers.txt'));
            
            //On regarde si l'adresse est admin ou pas
            $role = (str_contains($mailList,$request->email)) ? 'admin' : 'user';
            $isGoogleUser = $request->is_google_user;
            error_log($request->is_google_user);

            fclose($adminMailFile);

            if (isset($request->is_google_user)) {
                error_log("Google user");
                $user = User::create([
                    'last_name' => $request->last_name,
                    'first_name' => $request->first_name,
                    'birth_date' => $request->birth_date,
                    'email' => $request->email,
                    'password' => null,
                    'role' => $role,
                    'is_google_user' => 1
                ]);
            } else {
                error_log("Not Google User");
                $user = User::create([
                    'last_name' => $request->last_name,
                    'first_name' => $request->first_name,
                    'birth_date' => $request->birth_date,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => $role,
                    'is_google_user' => 0
                ]);
            }
            

            return response()->json([   
                'status' => true,
                'message' => 'User Created Successfully. Role : ' . $role,
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,  
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
   * Connecte l'utilisateur via Google
   *
   * @author Adrian Wahler adrian.wahler@gmail.coms
   *
   **/
    public function connectGoogleUser(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            return response()->json([
                'status' => true,
                'message' => 'User Logged In Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([   
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), 
            [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if(!Auth::attempt([
                'email'=>$request["email"],
                'password'=>$request["password"]
            ])){
                return response()->json([
                    'status' => false,
                    'message' => '/'.$request["email"].'/'.$request["password"].'/Email & Password does not match with our record.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();
            if($user->role !== "user") {
                $admin = true;
            }
            else {
                $admin = false;
            }
            return response()->json([
                'status' => true,
                'message' => 'User Logged In Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'is_admin' => $admin
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([   
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function logoutUser(Request $request)
    {
        try {

            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'User Logged Out Successfully'
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
