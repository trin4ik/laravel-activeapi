import React from 'react'

const Cube = ({value, color = 'default'}) => {
	return (
		<span className={"cube color-" + color}>
            {value}
        </span>
	)
}

export default Cube
