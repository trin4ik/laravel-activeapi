import React, { useEffect, useRef } from 'react'
import highlight from 'highlight.js'
import 'highlight.js/styles/github.css'

import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'

highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('bash', bash)
highlight.registerLanguage('json', json)

const Highlight = ({ className, style, language, children }) => {

	const codeRef = useRef(null)

	useEffect(() => {
		highlight.highlightAll()
	}, [children])

	return (
		<pre
			className={className}
			style={style}
		>
        <code
			className={'language-' + language}
			ref={codeRef}
		>
          {children}
        </code>
      </pre>
	)
}

export default Highlight
