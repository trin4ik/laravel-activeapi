<?php

namespace Trin4ik\ActiveApi;

use phpDocumentor\Reflection\DocBlockFactory;

class ActiveApiDoc
{
	private static $doc = null;

	public static function doc()
	{
		if (static::$doc === null) {
			static::$doc = DocBlockFactory::createInstance();
		}
		return static::$doc;
	}
}