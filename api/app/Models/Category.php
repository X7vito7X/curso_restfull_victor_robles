<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';


    public function posts()
    {
        //Relación de 1 a muchos
        //Una categoria tiene muchos POSTS
        return $this->hasMany('App\Models\Post');
    }

}
