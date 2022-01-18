<?php

namespace Trin4ik\ActiveApi\Console;

use Illuminate\Console\Command;
use Trin4ik\ActiveApi\ActiveApi;

class GenerateCommand extends Command
{
	protected $signature = 'activeapi:generate';

	protected $description = 'Generate ActiveApi';

	public function handle () {
		$this->info('Starting generate');
		$this->info('Routes list:');

		$activeapi = new ActiveApi(
			array_merge(
				config('activeapi.middleware'),
				config('activeapi.auth.middleware')
			)
		);


		foreach ($activeapi->items as $item) {
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
		}

		$this->info("Generate json");

		$json = $activeapi->generateJson();

		if (!file_exists(public_path(config('activeapi.path')))) mkdir(public_path(config('activeapi.path')), 0777, true);
		file_put_contents(public_path(config('activeapi.path') . '/api.json'), $json);

		$this->info('Done');
	}
}