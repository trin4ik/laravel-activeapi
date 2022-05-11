<?php

namespace Trin4ik\ActiveApi;

use Illuminate\Support\ServiceProvider;
use Trin4ik\ActiveApi\Console\GenerateCommand;
use Trin4ik\ActiveApi\Console\RouteCommand;

class ActiveApiServiceProvider extends ServiceProvider
{
	/**
	 * Bootstrap the application services.
	 */
	public function boot () {
		if ($this->app->runningInConsole()) {
			$this->publishes([
				__DIR__ . '/../config/config.php' => config_path('activeapi.php'),
			], 'config');
			$this->commands([
				GenerateCommand::class,
				RouteCommand::class,
			]);
		}
	}

	/**
	 * Register the application services.
	 */
	public function register () {
		// Automatically apply the package configuration
		$this->mergeConfigFrom(__DIR__ . '/../config/config.php', 'activeapi');

		// Register the main class to use with the facade
		$this->app->singleton('activeapi', function () {
			return new ActiveApi;
		});
	}
}
