<?php

return [
	'path' => 'activeapi',
	'title' => 'ActiveAPI',
	'description' => 'API documentation',
	'url' => env('ACTIVEAPI_URL', '/'),
	'auth' => [
		'enabled' => true,
		'type' => 'bearer',
		'description' => 'Authorization: Bearer',
		'middleware' => 'auth:api'
	],
	'version' => [
		'variable' => false,
	],
	'group' => [
		'variable' => false,
	],
	'header' => [
		'Content-Type' => 'application/json',
		'Accept' => 'application/json',
	],
	'middleware' => 'api',
];
