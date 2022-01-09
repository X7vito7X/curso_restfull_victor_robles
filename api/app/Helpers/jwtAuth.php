<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\Models\User;

Class jwtAuth
{
	Public function __construct()
    {
        $this->key = 'Esta_eS_miS_perCl4ve';
    }

    public function signup($email,$password,$getToken=null)
        {

        //Buscar si existe el usuario con las credenciales.
        $user = User::where([
            'email'     =>  $email,
            'password'  =>  $password
        ])->first();

        //Comprobar si son correctas.
            $signup = false;
            if(is_object($user))
                {
                    $signup = true;
                }
        //Generar el token con los datos del usuario identificado.
        if($signup)
            {
                $token = array(
                'sub'         =>  $user->id,
                'email'       =>  $user->email,
                'name'        =>  $user->name,
                'surname'     =>  $user->surname,
                'description' =>  $user->description,
                'image'       =>  $user->image,
                'iat'         =>time(),
                'exp'         =>time()+(7*24*60*60)
                );

                $jwt = JWT::encode($token,$this->key,'HS256');
                //var_dump($jwt);die();
                $decoded = JWT::decode($jwt,$this->key,['HS256']);

                if(is_null($getToken))
                {
                    $data = $jwt;
                }
                else
                {
                    $data = $decoded;
                }

            }
        else
            {
                $data = array(
                'status'	=>	'Error',
                'message'	=>	'Login Incorrecto'
                );
            }
            return $data;
    }
    public function checkToken($jwt, $getIdentity = false)
    {
        $auth = false;
        try{
            $jwt = str_replace('"','',$jwt);
            $decoded = JWT::decode($jwt,$this->key, ['HS256']);
        }catch(\UnexpectedValueException $e){
            $auth = false;
        }catch(\DomainException $e){
            $auth = false;
        }
        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub))
        {
            $auth = true;
        }
        else
        {
            $auth = false;
        }
        if($getIdentity)
        {
            return $decoded;
        }
        return $auth;
    }

}


?>
