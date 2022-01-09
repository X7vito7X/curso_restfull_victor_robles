<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PruebasController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\ApiAuthMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Ruta para testear el ORM
Route::get('/testOrm',[PruebasController::class,'testOrm']);

//! Rutas del controlador de usuarios
Route::post('/api/users/register',[UserController::class,'register']);
Route::post('/api/users/login',[UserController::class,'login']);
Route::put('/api/users/update',[UserController::class,'update']);
Route::post('/api/users/upload',[UserController::class,'upload'])->middleware(ApiAuthMiddleware::class);
Route::get('/api/users/avatar/{filename}',[UserController::class,'getImage']);
Route::get('/api/users/details/{id}',[UserController::class,'details']);

//! Rutas del controlador de categorias
Route::resource('/api/category', CategoryController::class);

//! Rutas del controlador de POST
Route::resource('/api/post', PostController::class);
Route::post('/api/post/upload',[PostController::class,'upload']);
Route::get('/api/post/image/{filename}',[PostController::class,'getImage']);
Route::get('/api/post/category/{id}',[PostController::class,'getPostByCategory']);
Route::get('/api/post/user/{id}',[PostController::class,'getPostByUser']);
