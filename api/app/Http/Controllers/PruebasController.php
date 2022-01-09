<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Category;
use App\Models\Post;

use Illuminate\Http\Request;

class PruebasController extends Controller
{
    public function testOrm()
    {
        /* $posts = Post::all();
        foreach($posts as $post)
        {
            echo "<h1>$post->title</h1>";
            echo "<p>$post->content</p>";
            echo "<span Style='color:gray;'>{$post->user->name} - {$post->category->name}</span>";
            echo "<hr>";
        } */

        $categories = Category::all();
        foreach($categories as $category)
        {
            echo "<h1>$category->name</h1>";
            
            foreach($category->posts as $post)
            {
                echo "<h3>$post->title</h3>";
                echo "<p>$post->content</p>";
                echo "<span Style='color:gray;'>{$post->user->name} - {$post->category->name}</span>";
            }
            echo "<hr>";
        }    
    }
}
