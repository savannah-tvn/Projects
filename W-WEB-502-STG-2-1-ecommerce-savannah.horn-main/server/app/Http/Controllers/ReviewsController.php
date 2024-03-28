<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reviews;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ReviewsController extends Controller
{
    function getReview($id){
        $reviews = DB::table('reviews')->where('collectionID',$id)->get();

        return response()->json($reviews, 200);
    }

    function getCollectionReviews($id){
        $reviews = DB::table('reviews')->where('id',$id)->first();

        return response()->json($reviews, 200);
    }
    
    function postReview(Request $request){

        $validateUser = Validator::make($request->all(), 
            [
                'collectionID' => 'required',
                'reviewerID' => 'required',
                'grade' => 'required',
                'review' => 'required',
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }
        
        $review = Reviews::create([
            'collectionID' => $request->collectionID,
            'reviewerID' => $request->reviewerID,
            'grade' => $request->grade,
            'review' => $request->review,
        ]);

        return response()->json([   
            'status' => true,
            'message' => 'Review succesfully created',
            'review' => $review,
            'test' => $request->all()
        ], 200);

    }

    function updateReview($id, Request $request){

        $id = $request['id'];
        unset($request['id']);
        
        foreach ($_POST as $key => $value) {
            if (Schema::hasColumn('reviews', $key) && $key != 'id'){
                DB::table('reviews')
                ->where('id', $id)
                ->update([$key => $value]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Review ID '.$id.' Updated Successfully',
        ], 200);

    }

    function deleteReview($id){
        $review = Reviews::find($id);
        $review->delete();

        return response()->json([   
            'status' => true,
            'message' => 'Review ' .$id. ' succesfully updated'
        ], 200);
    }
}
