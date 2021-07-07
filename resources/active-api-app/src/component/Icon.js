import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas, far);

const Icon = props => {
	return (
		<FontAwesomeIcon icon={typeof props.name === 'string' ? ['far', props.name] : props.name}
						 size={props.size ? props.size : "lg"} color={props.color ? props.color : '#fff'}
						 style={{ ...props.style, fontSize: 22 }}/>
	)
}
export default Icon
