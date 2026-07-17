<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'key',
        'title',
        'subtitle',
        'body',
        'image_path',
        'cta_label',
        'cta_url',
    ];
}
