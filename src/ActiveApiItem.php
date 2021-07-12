<?php

namespace Trin4ik\ActiveApi;

use Illuminate\Routing\Route;
use Illuminate\Support\Str;

class ActiveApiItem
{
	private $route = null;
	public $uri = null;

	public $controller = null;
	public $action = null;
	public $methods = null;
	public $needAuth = null;
	public $fields = [];
	public $params = [];

	public $variables = [];

	public $group = 'main';
	public $version = 'master';

	public function __construct(Route $route)
	{
		$this->route = $route;

		$this->parseUri();
		$this->parseAction();
		$this->parseMethods();
		$this->parseNeedAuth();
		$this->parseFields();
		$this->parseParams();
		$this->parseVariables();
	}

	private function parseUri()
	{
		$this->setUri($this->route->uri());
	}

	private final function setUri($data)
	{
		$this->uri = $data;
	}


	private function parseAction()
	{
		$original = get_class($this->route->getController());
		$title = last(explode('\\', $original));

		$controller = [
			'original' => $original,
			'slug' => strtolower($title),
			'title' => $title,
			'description' => null,
			'tags' => []
		];

		$original = last(explode('@', $this->route->getAction()['controller']));
		$title = $original;

		$action = [
			'original' => $original,
			'slug' => strtolower($title),
			'title' => $title,
			'description' => null,
			'tags' => []
		];

		if (config('activeapi.group.variable') !== false && isset($this->route->getAction()[config('activeapi.group.variable')])) {
			$this->group = $this->route->getAction()[config('activeapi.group.variable')];
		}

		if (config('activeapi.version.variable') !== false && isset($this->route->getAction()[config('activeapi.version.variable')])) {
			$this->version = $this->route->getAction()[config('activeapi.version.variable')];
		}

		$rc = new \ReflectionClass($controller['original']);


		if ($rc->getMethod($action['original'])->getDocComment()) {
			$doc_action = ActiveApiDoc::doc()->create($rc->getMethod($action['original'])->getDocComment());

			if ($doc_action) {
				$action['title'] = $doc_action->getSummary();
				$action['description'] = $doc_action->getDescription()->getBodyTemplate();

				foreach ($doc_action->getTags() as $tag) {

					if (!isset($action['tags'][$tag->getName()])) {
						$action['tags'][$tag->getName()] = $tag->__toString();
					} else {
						if (!is_array($action['tags'][$tag->getName()])) {
							$action['tags'][$tag->getName()] = [$action['tags'][$tag->getName()]];
						}
						$action['tags'][$tag->getName()][] = $tag->__toString();
					}
				}
			}
		}

		if ($rc->getDocComment()) {
			$doc_controller = ActiveApiDoc::doc()->create($rc->getDocComment());

			if ($doc_controller) {
				$controller['title'] = $doc_controller->getSummary();
				$controller['description'] = $doc_controller->getDescription()->getBodyTemplate();

				foreach ($doc_controller->getTags() as $tag) {
					if (!isset($controller['tags'][$tag->getName()])) {
						$controller['tags'][$tag->getName()] = $tag->__toString();
					} else {
						if (!is_array($controller['tags'][$tag->getName()])) {
							$controller['tags'][$tag->getName()] = [$controller['tags'][$tag->getName()]];
						}
						$controller['tags'][$tag->getName()][] = $tag->__toString();
					}
				}
			}
		}

		if (!empty($action['tags']['id'])) {
			$action['slug'] = $action['tags']['id'];
		}

		if (!empty($controller['tags']['group'])) {
			$controller['description'] = $controller['title'] . ($controller['description'] ? "<br /><br />\n\n" . $controller['description'] : '');
			$controller['title'] = $controller['tags']['group'];
		}

		if (!empty($controller['tags']['id'])) {
			$controller['slug'] = $controller['tags']['id'];
			//$this->controller_description = $this->controller_title . ($this->controller_description ? "<br /><br />\n\n" . $this->controller_description : '');
		}

		if (!empty($action['tags']['group'])) {
			$controller['description'] = $controller['title'] . ($controller['description'] ? "<br /><br />\n\n" . $controller['description'] : '');
			$controller['title'] = $action['tags']['group'];
		}
		if (!empty($action['tags']['field']) && !is_array($action['tags']['field'])) {
			$action['tags']['field'] = [$action['tags']['field']];
		}


		$action['slug'] = Str::slug($action['title']);
		$controller['slug'] = Str::slug($controller['title']);

		$this->setController($controller);
		$this->setAction($action);
	}

	private final function setAction($data)
	{
		$this->action = $data;
	}

	private final function setController($data)
	{
		$this->controller = $data;
	}

	private function parseMethods()
	{
		$methods = $this->route->methods();
		foreach ($methods as $k => $v) {
			if ($v === "HEAD") {
				unset($methods[$k]);
			}
		}
		$methods = array_merge($methods);

		$this->setMethods($methods);
	}

	private final function setMethods($data)
	{
		$this->methods = $data;
	}

	private function parseNeedAuth()
	{
		$this->setNeedAuth(false);
		foreach (explode(',', config('activeapi.auth.middleware')) as $middleware) {
			if (in_array($middleware, $this->route->getAction()['middleware'])) {
				$this->setNeedAuth(true);
				break;
			}
		}
	}

	private final function setNeedAuth($data)
	{
		$this->needAuth = $data;
	}

	private function parseFields()
	{
		$fields = [];

		foreach ($this->route->signatureParameters() as $param) {
			if ($param->name === 'request') {
				$tmp = $param->getType()->getName();
				if ((new \ReflectionClass($tmp))->hasMethod('rules')) {
					foreach ((new $tmp)->rules() ?: [] as $k2 => $v2) {
						if ((new \ReflectionClass($tmp))->hasMethod('ignored')) {
							$ignored = (new $tmp)->ignored();
							if (in_array($k2, $ignored)) {
								continue;
							}
						}

						$insert = [
							'id' => $k2,
							'name' => $k2,
							'text' => null,
							'type' => 'string',
							'nullable' => false,
							'required' => false,
							'extra' => [],
							'rules' => $v2,
							'rulesRaw' => $v2
						];

						foreach ($v2 as $k3 => $v3) {
							if (!is_string($v3)) {
								$v2[$k3] = $v3->__toString();
								$insert['rules'][$k3] = $v3->__toString();
							}

							switch ($v3) {
								case 'boolean':
								case 'numeric':
								case 'integer':
								case 'string':
								case 'array':
								case 'url':
								case 'date':
								case 'checkbox':
								{
									$insert['type'] = $v3;
									unset($insert['rules'][$k3]);
									break;
								}
								case 'nullable':
								{
									$insert['nullable'] = true;
									unset($insert['rules'][$k3]);
									break;
								}
								case 'required':
								{
									$insert['required'] = true;
									unset($insert['rules'][$k3]);
									break;
								}
								default:
								{
									if (substr($v3, 0, 3) === 'in:') {
										$insert['type'] = 'select';
										$insert['extra']['in'] = explode(',', substr($v3, 3));
										unset($insert['rules'][$k3]);
									}
								}
							}
						}

						if (isset($this->action['tags']['field'])) {
							foreach ($this->action['tags']['field'] as $field) {
								$mod = preg_split('~(?<!\\\\)(?:\\\\{2})*"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"(*SKIP)(*F)|\s+~s', $field);
								if (count($mod) === 2) {
									$mod[0] = str_replace('"', '', $mod[0]);
									$mod[1] = explode(',', $mod[1]);
								}
								if ($mod[0] === $insert['id']) {
									foreach ($mod[1] as $tmp) {
										$tmp = explode('=', $tmp);
										if (count($tmp) === 2) {
											$insert[$tmp[0]] = $tmp[1];
										}
									}
								}
							}
						}

						$fields[] = $insert;
					}
				}
			}
		}

		$this->setFields($fields);
	}

	private final function setFields($data)
	{
		$this->fields = $data;
	}

	private function parseParams()
	{
		$params = [];

		foreach ($this->route->signatureParameters() as $param) {
			if ($param->name !== 'request') {
				$params[] = $param->name;
			}
		}

		$this->setParams($params);
	}

	private final function setParams($data)
	{
		$this->params = $data;
	}

	private function parseVariables()
	{
		$vars = [];

		if (!empty($this->action['tags']['var'])) {
			$arr = preg_split('~(?<!\\\\)(?:\\\\{2})*"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"(*SKIP)(*F)|\s+~s', $this->action['tags']['var']);
			$arr[2] = str_replace('"', '', $arr[2]);
			$vars[] = ['data' => [
				'id' => $arr[1],
				'type' => $arr[0],
				'name' => $arr[1],
				'text' => $arr[2],
				'eval' => $arr[3],
				'group' => $this->group,
				'version' => $this->version
			], 'from' => [
				'controller' => $this->controller['slug'],
				'action' => $this->action['slug'],
				'url' => $this->uri,
			]];
		}

		$this->setVariables($vars);
	}

	private final function setVariables($data)
	{
		$this->variables = $data;
	}
}