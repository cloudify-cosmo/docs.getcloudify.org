'use strict';
const fs = require('fs')

var replacements = []

function createReplacement(search, replace) {
  return {
    search,
    replace
  };
}

// handle gsHighlight
replacements.push(createReplacement(
  /{{(?:<|%) *gsHighlight *(?:"?(\w*)"?)? *(?:>|%)}}(.+){{(?:<|%) *\/gsHighlight *(?:>|%)}}/ig,
  '```$1\n$2\n```'
))
replacements.push(createReplacement(
  /^ *{{(?:<|%) *\/?gsHighlight *(?:"?(\w*)"?)? *(?:>|%)}} *$/igm,
  '```$1'
))



// handle gsSummary|table
replacements.push(createReplacement(
  /{{(?:<|%) *(\/)?(?:gsSummary|table) *(?:>|%)}}/ig,
  ''
))
replacements.push(createReplacement(
  /{{(?:<|%) *(?:gsSummary|table) *(?:>|%)}}([\S\s]*){{(?:<|%) *\/(?:gsSummary|table) *(?:>|%)}}/ig,
  '$1'
))


// handle beginning of gsNote/gsTip/gsWarning/gsInfo
replacements.push(createReplacement(
  /(?:{{(?:%|<) *(?:gsNote|gsTip|gsWarning|gsInfo) *)(?:title=((?:'|")[^'"]+(?:'|")))?(\s*(?:%|>)}})/ig,
  '{% call c.note($1) %}'
))

// handle beginning of gsNote/gsTip/gsWarning/gsInfo
replacements.push(createReplacement(
  /(?:{{(?:%|<) *(?:collapse) *)(?:title=((?:'|")[^'"]+(?:'|")))? *(?:open=((?:'|")[^'"]+(?:'|")))?(?: *(?:%|>)}})/ig,
  '{% call c.collapse($1) %}'
))


// handle end of gsNote|gsTip|gsWarning|gsInfo|gsInitTab|gsTabContent|collapse
replacements.push(createReplacement(
  /({{(%|<)\s*\/(gsNote|gsTip|gsWarning|gsInfo|gsInitTab|gsTabContent|collapse)\s*(%|>)}})/ig,
  '{% endcall %}'
))

// handle gsCloak
replacements.push(createReplacement(
  /{{(?:<|%) *(\/)?gsCloak *.*(?:>|%)}}/ig,
  '```'
))


// handle gsHighlight
// replacements.push(createReplacement(
//   /{{< *\/?gsHighlight *[^>]*>}}/ig,
//   '```'
// ))

// handle {% highlight %}
replacements.push(createReplacement(
  /{% *(?:endhighlight|highlight) *.*%}/ig,
  '```'
))


// handle gsThumbnail
replacements.push(createReplacement(
  /{{(?:<|%) *gsThumbnail *src="([^"]+)" *(?:title="([^"]*)")? *(?:>|%)}}/ig,
  '{{ c.thumbnail("$1", "$2") }}'
))

// handle {{ img }}
replacements.push(createReplacement(
  /{{< *img (.+) *>}}/ig,
  '{{ c.img($1) }}'
))


// handle {{ field }}
replacements.push(createReplacement(
  /{{< *field *('|")([^'"]+)('|") *>}}/ig,
  '{{ $2 }}'
))

// handle {% relRef %}
replacements.push(createReplacement(
  new RegExp('{{< *relref (\'|\")([^\"\']+)(\'|\") *>}}', 'ig'),
  '{{ relRef("$2") }}'
))

// handle {% tag %}
replacements.push(createReplacement(
  /{{(?:<|%) *tag *(?:>|%)}}([^{]+){{(?:<|%) *\/tag *(?:>|%)}}/ig,
  '{{ c.tag("$1") }}'
))

// handle {{ tabs }}
replacements.push(createReplacement(
  /{{%\s*(\/)?gsInitTab\s*%}}/ig,
  '{% call c.tabs() %}'
))

// handle {{ tab }}
replacements.push(createReplacement(
  /{{(?:<|%) *\/?gsTabContent *\"([^\"]+)" *(?:>|%)}}/ig,
  '{% call c.tab("$1") %}'
))

function replace(text, replacements) {
  for (let replacement of replacements) {
    text = text.replace(replacement.search, replacement.replace)
  }
  return text;
}

let path = process.argv[2]
console.log(`processing ${path}`)
let text = fs.readFileSync(path, 'utf-8')
text = replace(text, replacements)
console.log('done')
fs.writeFileSync(path, text, 'utf-8')
