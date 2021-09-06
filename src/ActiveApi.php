<?php

namespace Trin4ik\ActiveApi;

use Illuminate\Support\Facades\Route;

class ActiveApi
{
	// Build your next great package.

	public $routes = [];
	public $items = [];

	public function __construct($middlewares = [])
	{
		$this->parseRoutes($middlewares);
		$this->fetchItems();
	}

	private function parseRoutes($middlewares = [])
	{
		$routes = Route::getRoutes();

		foreach ($routes as $route) {
			foreach ($middlewares as $middle) {
				if (in_array($middle, $route->gatherMiddleware())) {
					$this->routes[] = $route;
					break;
				}
			}
		}
	}

	private function fetchItems()
	{
		foreach ($this->routes as $route) {
			$this->items[] = new ActiveApiItem($route);
		}
	}

	public function generateJson()
	{
		$headers = [];

		foreach (config('activeapi.header') as $k=>$v) {
			$headers[$k] = $v;
		}

		$result = [
			"info" => [
				'generated_at' => time(),
				"name" => config('activeapi.title'),
				"text" => config('activeapi.description'),
				"url" => config('activeapi.url'),
				"auth" => [
					"enabled" => config('activeapi.auth.enabled'),
					"type" => config('activeapi.auth.type'),
					"description" => config('activeapi.auth.description')
				],
				"header" => $headers
			],
			"variable" => [],
			"api" => []
		];


		$groups = array_unique(\Arr::pluck($this->items, 'group'));
		foreach ($groups as $group) {
			$group_version = \Arr::where($this->items, function ($value) use ($group) {
				return $value->group === $group;
			});
			if (!isset($result['api'][$group])) {
				$result['api'][$group] = ['data' => [], 'info' => [
					'title' => config('activeapi.group.info.' . $group . '.title') ?: $group
				]];
			}

			$versions = array_unique(\Arr::pluck($group_version, 'version'));

			foreach ($versions as $version) {
				if (!isset($result['api'][$group]['data'][$version])) {
					$result['api'][$group]['data'][$version] = ['data' => [], 'info' => [
						'title' => config('activeapi.version.info.' . $version . '.title') ?: $version
					]];
				}
				foreach ($this->items as $item) {
					if ($item->group !== $group || $item->version !== $version) continue;

					$controller = false;

					foreach ($result['api'][$group]['data'][$version]['data'] as $k => $v) {
						if ($v['id'] === $item->controller['slug']) {
							$controller = $k;
							break;
						}
					}
					if ($controller === false) {
						$result['api'][$group]['data'][$version]['data'][] = [
							'id' => $item->controller['slug'],
							'name' => $item->controller['title'],
							'text' => $item->controller['description'],
							'tags' => $item->controller['tags'],
							'action' => []
						];
						$controller = count($result['api'][$group]['data'][$version]['data']) - 1;
					}

					$result['api'][$group]['data'][$version]['data'][$controller]['action'][] = [
						'id' => $item->action['slug'],
						'name' => $item->action['title'],
						'text' => $item->action['description'],
						'tags' => $item->action['tags'],
						'auth' => $item->needAuth,
						'url' => $item->uri,
						'method' => $item->methods[0],
						'param' => $item->params,
						'field' => $item->fields,
					];

					usort($result['api'][$group]['data'][$version]['data'][$controller]['action'], function ($a, $b) {
						return (isset($a['tags']['position']) ? (int)$a['tags']['position'] : 9999) > (isset($b['tags']['position']) ? (int)$b['tags']['position'] : 9999);
					});

					$result['variable'] = array_merge($result['variable'], $item->variables);
				}

				usort($result['api'][$group]['data'][$version]['data'], function ($a, $b) {
					return (isset($a['tags']['position']) ? (int)$a['tags']['position'] : 9999) > (isset($b['tags']['position']) ? (int)$b['tags']['position'] : 9999);
				});
			}
		}

		return json_encode($result, JSON_PRETTY_PRINT);
	}
}
