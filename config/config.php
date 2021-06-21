<?php

return [
	'path' => env('ACTIVEAPI_PATH', 'activeapi'),
	'title' => env('ACTIVEAPI_TITLE', 'ActiveAPI'),
	'description' => env('ACTIVEAPI_DESCRIPTION', 'API documentation'),
	'url' => env('ACTIVEAPI_URL', '/'),
	'auth' => [
		'enabled' => env('ACTIVEAPI_AUTH', true),
		'type' => env('ACTIVEAPI_AUTH_TYPE', 'bearer'),
		'description' => env('ACTIVEAPI_AUTH_DESCRIPTION', 'Authorization: Bearer'),
		'middleware' => env('ACTIVEAPI_AUTH_MIDDLEWARE', 'auth:api')
	],
	'version' => [
		'variable' => env('ACTIVEAPI_VERSION', false),
	],
	'group' => [
		'variable' => env('ACTIVEAPI_GROUP', false),
	],
	'header' => env('ACTIVEAPI_HEADER', 'Content-Type: application/json\r\nAccept: application/json'),
	'middleware' => env('ACTIVEAPI_MIDDLEWARE', 'api'),
];
