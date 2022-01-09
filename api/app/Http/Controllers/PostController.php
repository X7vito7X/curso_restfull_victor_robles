<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Post;
use App\Helpers\jwtAuth;

class PostController extends Controller
{
    public function __construct()
    {
        //TODOS Exceptuando los metodos del Middleware
        $this->middleware('api.auth',['except' =>
        [
            'index',
            'show',
            'getImage',
            'getPostByCategory',
            'getPostByUser'
        ]]);
    }
    //Todos METODO PARA MOSTRAR TODOS LOS POSTS
    public function index()
    {
        $posts = Post::all()->load('category');
        return response()->json([

            'Code' => 200,
            'Status' => 'success',
            'posts' => $posts

        ],200);
    }
    //TODOS METODO PARA MOSTRAR 1 POST
    public function show($id)
    {
        $post = Post::find($id)->load('category')
        ->load('user');

        if(is_object($post))
        {
        $data = array(

            'code' => 200,
            'status' => 'success',
            'posts' => $post
        );
        }
        else
        {
                $data = array
                (
                'code' => 404,
                'status' => 'error',
                'mensaje' => 'El post no existe'
                );
        }
    return response()->json($data, $data['code']);
    }

    //TODOS METODO PARA GUARDAR LOS POSTS
    public function store(Request $request)
    {
        //*recoger los datos por POST
        $json = $request->input('json',null);
        $params = json_decode($json); //parámetros en objeto.
        $params_array = json_decode($json,true); //parámetros en array.
        if(!empty($params)&&!empty($params_array))
        {
            //* Conseguir el usuario identificado
            $user = $this->getIdentity($request);

            //*Limpiar datos recibidos por JSON con el método trim.
            $params_array = array_map('trim', $params_array);

            //*Validar los datos
            $validate = \Validator::make($params_array, [
                'title'             =>	    'required',
                'content'           =>	    'required',
                'category_id'       =>	    'required',
                'image'             =>	    'required'
            ]);
            if($validate->fails())
            {
                $data = array(
                    'status'	=>	'error',
                    'code'		=>	404,
                    'message'	=>	'El post no se ha creado, faltan datos',
                    'errors'	=>	$validate->errors()
                );
            }
            else
            {
                //*Guardar el articulo
                $post = new Post();
                $post->title = $params_array['title'];
                $post->content = $params_array['content'];
                $post->image = $params_array['image'];
                $post->category_id = $params_array['category_id'];
                $post->user_id = $user->sub;
                $post->save();

                //*Devolver el resultado
                $data = array(
                    'status'	=>	'success',
                    'code'		=>	200,
                    'message'	=>	'El post se ha creado correctamente',
                    'post'	=>	$post
                );
            }
        }
        else
        {
            $data = array(
                'status'	=>	'error',
                'code'		=>	404,
                'message'	=>	'La categoria no se ha podido crear'
            );
        }
        return response()->json($data, $data['code']);
    }

    //TODOS METODO PARA ACTUALIZAR POST
    public function update($id,Request $request)
    {
        // *Recoger el JSON con los datos de usuario por medio del método POST.
        $json = $request->input('json',null);
        $params_array = json_decode($json,true); //parámetros en array.

        //Datos para devolver
        $data = array(
            'status'	=>	'error',
            'code'		=>	404,
            'message'	=>	'Datos enviados de manera incorrecta'
        );

        if(!empty($params_array))
        {
            //*Validamos los datos
            //$params_array = array_map('trim', $params_array);

            //*Validar los datos
            $validate = \Validator::make($params_array, [
                'title'           =>	    'required',
                'content'         =>	    'required',
                'category_id'     =>	    'required'
            ]);
            if($validate->fails())
            {
                $data['errors']=$validate->errors();
                return response()->json($data,['code']);
            }
            //* quitamos los campos que no vamos a actualizar
            unset($params_array['id']);
            unset($params_array['user_id']);
            unset($params_array['created_at']);

            //* Conseguir el usuario identificado
            $user = $this->getIdentity($request);

            //*Buscar el registro a actualizar
            $post = Post::where('id',$id)
            ->where('user_id',$user->sub)
            ->first();

                if(!empty($post) && is_object($post))
                {
                    //*Actualizar el registro en concreto
                    $post->update($params_array);

                    //*devuevlo un array con el resultado
                    $data = array(
                        'status'	=>	'success',
                        'code'		=>	200,
                        'message'	=>	'Post Actualizado',
                        'posts'	    =>	$post,
                        'actualizado'	    =>	$params_array
                    );
            }
        }
        return response()->json($data, $data['code']);
    }
    public function destroy($id, Request $request)
    {

        //* Conseguir el usuario identificado
        $user = $this->getIdentity($request);

        //* Conseguir el registro
        $post = Post::where('id',$id)
                    ->where('user_id',$user->sub)
                    ->first();
        if(!empty($post))
        {
            //* Borrarlo
            $post->delete();
            //* Devolver algo
            $data = array(
                'status'	=>	'Sucess',
                'code'		=>	200,
                'message'	=>	'El post ha sido borrado',
                'Post'	    =>	$post
                );
        }
        else
        {
            $data = array(
                'status'	=>	'Fallo',
                'code'		=>	400,
                'message'	=>	'No existe el post'
                );
        }

        return response()->json($data, $data['code']);
    }
    public function getIdentity(Request $request)
    {
        $jwtauth = new \JwtAuth();
        $token = $request->header('Authorization',null);
        $user = $jwtauth->checkToken($token,true);
        return $user;
    }
    //* Funcion para subir las miniaturas
    public function upload(Request $request)
    {
        //*Recibimos el archivo a subir
        $image = $request->file('file0');
        //*Validacion de imágen
        $validate = \Validator::make($request->all(), [
            'file0'      =>	    'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        //* Guardamos la imagen
        if(!$image || $validate->fails())
        {
            $data = array(
                'status'	=>	'error',
                'code'		=>	400,
                'message'	=>	'Error al subir imagen',
                'Error'	    =>	$validate->errors()
            );
        }
        else
        {
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('images')->put($image_name, \File::get($image));

            $data = array(
                'status'	=>	'Sucess',
                'code'		=>	200,
                'image'	=>	$image_name
            );
        }
        return response()->json($data, $data['code']);
    }
    public function getImage($filename)
    {
        //*Comprobar si existe el fichero
        $isset = \Storage::disk('images')->exists($filename);
        if($isset)
        {
            //*Saco la imagen del disco y la guardo en la variable
            $file = \Storage::disk('images')->get($filename);
            return new Response($file,200);
        }
        else
        {
            //*Mostrar el error
            $data = array(
                'status'	=>	'Fallo',
                'code'		=>	404,
                'Mensaje'	=>	'No existe la  imagen'
            );
            return response()->json($data, $data['code']);
        }
    }
    //Todos LISTAR LOS POSTS POR CATEGORIAS
    public function getPostByCategory($id)
    {
        $post = Post::where('category_id',$id)->get();
        $data = array(
            'status'	=>	'success',
            'code'		=>	200,
            'posts'	=>	$post
        );
        return response()->json($data, $data['code']);
    }
    //Todos LISTAR LOS POST POR USUARIO
    public function getPostByUser($id)
    {
        $post = Post::where('user_id',$id)->get();
        $data = array(
            'status'	=>	'success',
            'code'		=>	200,
            'posts'	=>	$post
        );
        return response()->json($data, $data['code']);
    }

}
