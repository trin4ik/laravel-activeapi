<?php

namespace Trin4ik\ActiveApi;

use Illuminate\Support\ServiceProvider;
use Trin4ik\ActiveApi\Console\BuildAppCommand;
use Trin4ik\ActiveApi\Console\GenerateCommand;

class ActiveApiServiceProvider extends ServiceProvider
{
	/**
	 * Bootstrap the application services.
	 */
	public function boot()
	{
		/*
		 * Optional methods to load your package assets
		 */
		// $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'activeapi');
		// $this->loadViewsFrom(__DIR__.'/../resources/views', 'activeapi');
		// $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
		// $this->loadRoutesFrom(__DIR__.'/routes.php');

		if ($this->app->runningInConsole()) {
			$this->publishes([
				__DIR__ . '/../config/config.php' => config_path('activeapi.php'),
			], 'config');
			$this->commands([
				GenerateCommand::class,
			]);
		}
	}

	/**
	 * Register the application services.
	 */
	public function register()
	{
		// Automatically apply the package configuration
		$this->mergeConfigFrom(__DIR__ . '/../config/config.php', 'activeapi');

		// Register the main class to use with the facade
		$this->app->singleton('activeapi', function () {
			return new ActiveApi;
		});

		$this->publishes([
			__DIR__ . '/../resources/active-api-app' => resource_path('active-api-app'),
		]);
	}
}
