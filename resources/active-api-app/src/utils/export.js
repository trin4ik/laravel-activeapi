import Handlebars from "handlebars"

const TAB = "    "

Handlebars.registerHelper('json', context => {
	console.log('context', context)
	return JSON.stringify(context, null, TAB + TAB).slice(0, -1) + TAB + "}"
})
Handlebars.registerHelper('value', context => {
	const result = {}
	context.map(item => result[item.id] = item.value)
	return JSON.stringify(result, null, TAB + TAB).slice(0, -1) + TAB + "}"
})
Handlebars.registerHelper('jsonPlaint', context => {
	return JSON.stringify(context)
})
Handlebars.registerHelper('uppercase', context => {
	return context.toUpperCase()
})

class Export {
	static convert = (lang, data) => {
		if (typeof this['convertTo' + lang.charAt(0).toUpperCase() + lang.slice(1)] === 'function') {
			return this['convertTo' + lang.charAt(0).toUpperCase() + lang.slice(1)](data)
		}
		return null;
	}

	static convertToFetch = (data) => {
		return Handlebars.compile('' +
			'fetch("{{{url}}}", {\n' +
			TAB + 'method: "{{uppercase method}}",\n' +
			(
				['get', 'delete'].indexOf(data.method.toLowerCase()) === -1 ?
					(
						TAB + 'body: {{{json data}}},\n'
					)
					: ''
			) +
			TAB + 'headers: {{{json header}}}\n' +
			'})\n' +
			TAB + '.then(response => response.json())\n' +
			TAB + '.then(data => console.log("response", data))\n' +
			TAB + '.catch(error => console.error("error", error))')(data)
	}

	static convertToCurl = (data) => {
		console.log(data);
		return Handlebars.compile('' +
			'curl -X {{uppercase method}} \\\n' +
			TAB + '{{{url}}} \\\n' +
			'{{#each header}}' +
			TAB + '-H "{{@key}}: {{this}}" \\\n' +
			'{{/each}}' +
			(
				['get', 'delete'].indexOf(data.method.toLowerCase()) === -1 ?
					(
						TAB + '-d \'{{{jsonPlaint data}}}\''
					)
					: ''
			))(data)
	}
}

export default Export
