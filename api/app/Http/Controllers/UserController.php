<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\User;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $jwtauth = new \JwtAuth();
        //todosRecibir datos por POST
        $json = $request->input('json',null);
        $params = json_decode($json);
        $params_array = json_decode($json,true);

        //Validamos la información
        $validate = \Validator::make($params_array, [

            'email'     => 'required|email',
            'password'  => 'required',

        ]);
        if($validate->fails()){

            $signup = array(

                'status'=> 'error',
                'code'=> 404,
                'message'=> 'El Usuario no se ha podido identificar',
                'errors'=>$validate->errors(),
            );
        }
        else
        {
            //todosCifrar la password
            $pwd = hash('sha256',$params->password);

            //todosDevolver token o datos
            $signup = $jwtauth->signup($params->email,$pwd);
            if(!empty($params->getToken))
            {
                $signup = $jwtauth->signup($params->email,$pwd,true);
            }
        }
        return response()->json($signup,200);

    }

    public function register(Request $request)
    {
        // *Recoger el JSON con los datos de usuario por medio del método POST.
        $json = $request->input('json',null);

        //*Se debe decodificar el JSON como parámetro o array.
        $params = json_decode($json); //parámetros en objeto.
        $params_array = json_decode($json,true); //parámetros en array.

        //*Puedes validar si hay datos en los parámetros
        if(!empty($params)&&!empty($params_array))
            {

                //*Limpiar datos recibidos por JSON con el método trim.
                $params_array = array_map('trim', $params_array);

                //todos Validar que los datos sean digitados de manera correcta.
                $validate = \Validator::make($params_array, [
                    'name'       =>	    'required|alpha',
                    'surname'    =>	    'required|alpha',
                    'email'      =>	    'required|email|unique:users',
                    'password'   =>	    'required'
                ]);
                if($validate->fails())
                {
                    $data = array(
                        'status'	=>	'Error',
                        'code'		=>	404,
                        'message'	=>	'El usuario no se ha creado',
                        'errors'	=>	$validate->errors()
                    );
                }
                else
                    {
                        //*CIFRAMOS LA CONTRASEÑA DEL USUARIO
                        $pwd = hash('sha256',$params->password);
                        //*GUARDAMOS LOS USUARIOS
                        $user = new User();
                        $user->name = $params_array['name'];
                        $user->surname = $params_array['surname'];
                        $user->role = $params_array['role'];
                        $user->email = $params_array['email'];
                        $user->password = $pwd;
                        $user->save();
                        //*MENSAJE DE EXITO
                        $data = array(
                            'status'	=>	'Sucess',
                            'code'		=>	200,
                            'message'	=>	'El usuario se ha creado correctamente'
                        );
                    }


            }
            else
            {
                $data = array(
                    'status'	=>	'Error',
                    'code'		=>	404,
                    'message'	=>	'Los datos enviados no son correctos',
                );
            }
            return response()->json($data, $data['code']);
    }

    public function update(Request $request)
    {
        //* Comprobamos que el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtauth = new \JwtAuth();
        $checkToken = $jwtauth->checkToken($token);

        // *Recoger el JSON con los datos de usuario por medio del método POST.
        $json = $request->input('json',null);
        //*Se debe decodificar el JSON como parámetro o array.
        $params_array = json_decode($json,true); //parámetros en array.

        if($checkToken && !empty($params_array))
        {
            //* Sacar usuario identificado
            $user = $jwtauth->checkToken($token,true);
            // *Validamos la información que vamos a actualizar
            $validate = \Validator::make($params_array, [
                'name'       =>	    'required|alpha',
                'surname'    =>	    'required|alpha',
                'email'      =>	    'required|email|unique:users,email,'.$user->sub
            ]);
            if($validate->fails())
                {
                    $data = array(
                        'status'	=>	'error',
                        'code'		=>	404,
                        'message'	=>	'El usuario no se ha actualizado',
                        'errors'	=>	$validate->errors()
                    );
                }
                else
                {
                //* quitamos los campos que no vamos a actualizar
                unset($params_array['id']);
                unset($params_array['role']);
                unset($params_array['password']);
                unset($params_array['created_at']);
                unset($params_array['remember_token']);

                //*Actualizamos el USER en la BD
                $user_update = User::where('id',$user->sub)->update($params_array);

                //*devuevlo un array con el resultado
                $data = array(
                    'status'	=>	'success',
                    'code'		=>	200,
                    'message'	=>	'El usuario se ha actualizado',
                    'actualizado'	    =>	$params_array,
                    'original'	        =>	$user
                );
                }
        }

        else
        {
            $data = array(
                'status'	=>	'error',
                'code'		=>	400,
                'message'	=>	'El usuario no se ha actualizado'
            );
        }
        return response()->json($data, $data['code']);
    }
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
            \Storage::disk('users')->put($image_name, \File::get($image));

            $data = array(
                'status'	=>	'success',
                'code'		=>	200,
                'image'	=>	$image_name
            );
        }
        return response()->json($data, $data['code']);
    }
    public function getImage($filename)
    {
        $isset = \Storage::disk('users')->exists($filename);
        if($isset)
        {
            //*Saco la imagen del disco y la guardo en la variable
            $file = \Storage::disk('users')->get($filename);
            return new Response($file,200);
        }
        else
        {
            $data = array(
                'status'	=>	'Fallo',
                'code'		=>	404,
                'Mensaje'	=>	'No existe la  imagen'
            );
            return response()->json($data, $data['code']);
        }

    }
    public function  details($id)
    {
        $user = User::find($id);

        if(is_object($user))
        {
            $data = array(
                'status'	=>	'success',
                'code'		=>	202,
                'user'	=>	$user
            );
        }
        else
        {
            $data = array(
            'status'	=>	'error',
            'code'		=>	404,
            'Mensaje'	=>	'El usuario no existe'
        );
        }
        return response()->json($data, $data['code']);
    }
}


