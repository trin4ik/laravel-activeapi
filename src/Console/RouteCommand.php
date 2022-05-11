<?php

namespace Trin4ik\ActiveApi\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Trin4ik\ActiveApi\ActiveApi;
use Trin4ik\ActiveApi\ActiveApiItem;

class RouteCommand extends Command
{
	protected $signature = 'activeapi:route {url} {method?}';

	protected $description = 'Generate ActiveApi for url';

	public function handle () {
		$this->info('Starting generate');
		$this->info('Routes list:');

		$url = $this->argument('url');
		$method = $this->argument('method') ?: 'GET';

		$item = new ActiveApiItem(app('router')->getRoutes()->match(app('request')->create($url, $method)));

		if (!$item) {
			return;
		}

		$this->warn(
			implode('', [
				$item->group,
				' ▶ ',
				$item->controller['title'],
				' ▶ ',
				$item->action['title'],
				' (',
				$item->controller['slug'],
				'/',
				$item->action['slug'],
				') [',
				implode(', ', $item->methods),
				' ',
				$item->uri,
				']'
			])
		);

		$this->info("Generate json");

		print_r(json_encode($item->toArray(), JSON_PRETTY_PRINT));

		/*$json = $activeapi->generateJson();

		if (!file_exists(public_path(config('activeapi.path')))) mkdir(public_path(config('activeapi.path')), 0777, true);
		file_put_contents(public_path(config('activeapi.path') . '/api.json'), $json);

		$this->info('Done');*/
	}
}