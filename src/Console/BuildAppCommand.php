<?php

namespace Trin4ik\ActiveApi\Console;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BuildAppCommand extends Command
{
	protected $signature = 'activeapi:build';

	protected $description = 'Build ActiveApi app';

	public function handle()
	{
		$this->info('Write config to active-api-app');
		$package = json_decode(file_get_contents(resource_path('active-api-app/package.json')), true);
		$package['scripts']['build'] = 'react-scripts build  && rm -rf ' . public_path(config('activeapi.path')) . ' && mv ./build/ ' . public_path(config('activeapi.path'));
		file_put_contents(resource_path('active-api-app/package.json'), json_encode($package, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
		$this->info('Build project');
		$this->info(passthru('cd ' . resource_path('active-api-app') . ' && yarn && yarn build'));
		$this->call('activeapi:generate');
	}
}