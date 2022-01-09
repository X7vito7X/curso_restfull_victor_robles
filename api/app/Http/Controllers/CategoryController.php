<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Category;

class CategoryController extends Controller
{

    public function __construct()
    {
        //TODOS Exceptuando los metodos del Middleware
        $this->middleware('api.auth',['except' => ['index','show']]);
    }

    public function index() //TODOS METODO PARA MOSTRAR TODAS LAS CATEGORIAS
    {
        $categories = Category::all();
        return response()->json([

            'code' => 200,
            'status' => 'success',
            'categories' => $categories

        ]);
    }
    public function show($id) //TODOS METODO PARA MOSTRAR 1 CATEGORIA
    {

        $category = Category::find($id);

        if(is_object($category))
        {
        $data = array(

            'code' => 200,
            'status' => 'success',
            'category' => $category
        );
        }
        else
        {
                $data = array
                (
                'code' => 404,
                'status' => 'error',
                'mensaje' => 'La categoria no existe'
                );
        }
    return response()->json($data, $data['code']);
    }
    public function store(Request $request) //TODOS METODO PARA GUARDAR LA CATEGORIAS
    {
        //*recoger los datos por POST
        $json = $request->input('json',null);
        $params = json_decode($json); //parámetros en objeto.
        $params_array = json_decode($json,true); //parámetros en array.
        if(!empty($params)&&!empty($params_array))
        {
            //*Limpiar datos recibidos por JSON con el método trim.
            $params_array = array_map('trim', $params_array);

            //*Validar los datos
            $validate = \Validator::make($params_array, [
                'name'       =>	    'required|alpha',
            ]);
            if($validate->fails())
            {
                $data = array(
                    'status'	=>	'error',
                    'code'		=>	404,
                    'message'	=>	'La categoria no se ha creado',
                    'errors'	=>	$validate->errors()
                );
            }
            else
            {
                //*Guardar las categorias.
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();

                //*Devolver el resultado
                $data = array(
                    'status'	=>	'success',
                    'code'		=>	200,
                    'message'	=>	'La categoria se ha creado correctamente',
                    'category'	=>	$category
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
    public function update($id,Request $request)
    {
        // *Recoger el JSON con los datos de usuario por medio del método POST.
        $json = $request->input('json',null);
        $params_array = json_decode($json,true); //parámetros en array.

        if(!empty($params_array))
        {
            //*Limpiar datos recibidos por JSON con el método trim.
            $params_array = array_map('trim', $params_array);

            //*Validar los datos
            $validate = \Validator::make($params_array, [
                'name'       =>	    'required|alpha',
            ]);
            if($validate->fails())
            {
                $data = array(
                    'status'	=>	'Error',
                    'code'		=>	404,
                    'message'	=>	'La categoria no se ha actualizado',
                    'errors'	=>	$validate->errors()
                );
            }
            else
            {
                //* quitamos los campos que no vamos a actualizar
                unset($params_array['id']);
                unset($params_array['created_at']);

                //*Actualizamos categoria en la BD
                $category_update = Category::where('id',$id)->update($params_array);

                //*devuevlo un array con el resultado
                $data = array(
                    'status'	=>	'Sucess',
                    'code'		=>	200,
                    'message'	=>	'Categoria Actualizada',
                    'actualizado'	    =>	$params_array
                );
            }
        }
        else
        {
            $data = array(
            'status'	=>	'Fail',
            'code'		=>	400,
            'message'	=>	'La categoria no se actualizó'
            );
        }
        return response()->json($data, $data['code']);
    }
}
