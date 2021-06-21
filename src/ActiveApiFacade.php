<?php

namespace Trin4ik\ActiveApi;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Trin4ik\ActiveApi\Skeleton\SkeletonClass
 */
class ActiveApiFacade extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'activeapi';
    }
}
