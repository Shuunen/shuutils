import { countPlaceholders, injectMark } from './string-inject-mark.ts'

describe('string-inject-mark', () => {
  const injectMarkTests = [
    {
      example: 'simple placeholder with underscores',
      input: 'Version: __my-placeholder__',
      output: 'Version: MARK',
    },
    {
      example: 'simple placeholder with mustache',
      input: 'Version: {{ my-placeholder }}',
      output: 'Version: MARK',
    },
    {
      example: 'placeholder inside a div with id',
      input: '<div id="my-placeholder">Old Content</div>',
      output: '<div id="my-placeholder">MARK</div>',
    },
    {
      example: 'placeholder inside a more complex HTML/JSX structure',
      input: `<motion.div variants={textAnimation}>
            {            <div className="text-center text-sm font-mono pb-4" id="my-placeholder"></div>
          </motion.div>`,
      output: `<motion.div variants={textAnimation}>
            {            <div className="text-center text-sm font-mono pb-4" id="my-placeholder">MARK</div>
          </motion.div>`,
    },
    {
      example: 'placeholder inside a JSX function call',
      input: 'O.jsx(wt.div,{variants:cn,children:O.jsx("div",{className:"text-center text-sm font-mono pb-4",id:"my-placeholder"})})]})})}',
      output: 'O.jsx(wt.div,{variants:cn,children:O.jsx("div",{className:"text-center text-sm font-mono pb-4",id:"my-placeholder",children:"MARK"})})]})})}',
    },
    {
      example: 'empty string',
      input: '',
      output: '',
    },
    {
      example: 'string without placeholder',
      input: 'Hello world',
      output: 'Hello world',
    },
    {
      example: 'string that contains one placeholder on a meta tag',
      input: '<meta name="my-placeholder" content="..." />',
      output: '<meta name="my-placeholder" content="MARK" />',
    },
    {
      example: 'string that contains one placeholder on a meta tag with reversed attributes',
      input: '<meta content="..." name="my-placeholder" />',
      output: '<meta content="MARK" name="my-placeholder" />',
    },
    {
      example: 'string that contains one placeholder on a meta tag with additional attributes',
      input: '<meta charset="UTF-8" name="my-placeholder" content="..." />',
      output: '<meta charset="UTF-8" name="my-placeholder" content="MARK" />',
    },
    {
      example: 'complex string with multiple placeholders',
      input: 'Hello __my-placeholder__ I like <meta name="my-placeholder" content="..." /> and <div id="my-placeholder" class="mt-6 p-4">OLD-mark</div> :)',
      output: 'Hello MARK I like <meta name="my-placeholder" content="MARK" /> and <div id="my-placeholder" class="mt-6 p-4">MARK</div> :)',
    },
    {
      example: 'a meta with a < in an earlier attribute value',
      input: '<meta title="1<2" name="my-placeholder" content="..." />',
      output: '<meta title="1<2" name="my-placeholder" content="MARK" />',
    },
    {
      example: 'an element with a < in an earlier attribute value',
      input: '<div title="<" id="my-placeholder">a</div>',
      output: '<div title="<" id="my-placeholder">MARK</div>',
    },
    {
      example: 'a meta with a data-content attribute before its content',
      input: '<meta name="my-placeholder" data-content="x" content="..." />',
      output: '<meta name="my-placeholder" data-content="x" content="MARK" />',
    },
    {
      example: 'a meta whose content attribute is in the next tag',
      input: '<meta name="my-placeholder"><meta content="x">',
      output: '<meta name="my-placeholder"><meta content="x">',
    },
    {
      example: 'a meta without content then one with it',
      input: '<meta name="my-placeholder"><meta name="my-placeholder" content="b">',
      output: '<meta name="my-placeholder"><meta name="my-placeholder" content="MARK">',
    },
    {
      example: 'an unclosed meta',
      input: '<meta name="my-placeholder" content="x',
      output: '<meta name="my-placeholder" content="x',
    },
    {
      example: 'an element without closing tag',
      input: '<div id="my-placeholder">a',
      output: '<div id="my-placeholder">a',
    },
    {
      example: 'an element holding another element',
      input: '<div id="my-placeholder"><b>x</b></div>',
      output: '<div id="my-placeholder"><b>x</b></div>',
    },
    {
      // Value: protects=an id attribute after a lone "<" that opens no tag is left alone; fails_when=tagStart falls back to any earlier "<"; why_new=no row had no tag start at all; seam=none; no_claim=jsx
      example: 'an id attribute after a < that opens no tag',
      input: 'a < b id="my-placeholder">x</div>',
      output: 'a < b id="my-placeholder">x</div>',
    },
    {
      // Value: protects=an id-like text after a closed tag is not taken for an attribute of that tag; fails_when=tagStart stops rejecting a head that holds a ">"; why_new=no row had the attribute outside its tag; seam=none; no_claim=a ">" inside an attribute value
      example: 'an id attribute in the text after a closed tag',
      input: '<p>Set id="my-placeholder">old</p>',
      output: '<p>Set id="my-placeholder">old</p>',
    },
    {
      // Value: protects=a "<" at the very start that opens no tag ends the tag search; fails_when=tagStart searches again from index 0 and loops forever; why_new=the lone "<" row has it at index 2; seam=none; no_claim=meta tags
      example: 'an id attribute after a < at the start that opens no tag',
      input: '<= id="my-placeholder">x</b>',
      output: '<= id="my-placeholder">x</b>',
    },
    {
      // Value: protects=a selector after a "<" comparison in a minified chunk is not taken for a tag; fails_when=tagsWith matches an attribute with no whitespace before it; why_new=no row had a selector; seam=none; no_claim=other js shapes
      example: 'an id selector after a < comparison in minified code',
      input: `for(i=0;i<n.length;i++)q('[id="my-placeholder"]');f=()=>g(x);h='</b>'`,
      output: `for(i=0;i<n.length;i++)q('[id="my-placeholder"]');f=()=>g(x);h='</b>'`,
    },
    {
      // Value: protects=single braces like js destructuring are not a placeholder; fails_when=the mustache form accepts one brace again; why_new=only {{ }} was tested; seam=none; no_claim=__name__ form
      example: 'single braces around an identifier-like placeholder',
      input: 'const {my-placeholder}=p;log({ my-placeholder })',
      output: 'const {my-placeholder}=p;log({ my-placeholder })',
    },
    {
      // Value: protects=a jsx placeholder minified by rolldown, with backticks and a (0,e.jsx)( call, gets its mark; fails_when=injectInJsx only knows the .jsx( call and double quotes; why_new=every jsx row was vite shaped; seam=none; no_claim=other minifiers
      example: 'a jsx call minified by rolldown',
      input: 'var t=(0,e.jsx)(`span`,{id:`my-placeholder`});',
      output: 'var t=(0,e.jsx)(`span`,{id:`my-placeholder`,children:"MARK"});',
    },
    {
      // Value: protects=a rolldown minified jsx call marked by a previous run gets its mark replaced; fails_when=the backtick of the attribute itself is taken for a template literal; why_new=the previous run row uses double quotes; seam=none; no_claim=other minifiers
      example: 'a jsx call minified by rolldown already marked by a previous run',
      input: '(0,e.jsx)(`span`,{id:`my-placeholder`,children:"OLD"})',
      output: '(0,e.jsx)(`span`,{id:`my-placeholder`,children:"MARK"})',
    },
    {
      // Value: protects=a children key inside a nested object is not taken for the element children; fails_when=the nested object guard is dropped; why_new=no row had a nested children; seam=none; no_claim=deeper nesting
      example: 'a jsx call with a children key in a nested object',
      input: 'r.jsx("span",{id:"my-placeholder",style:{children:"x"}})',
      output: 'r.jsx("span",{id:"my-placeholder",children:"MARK",style:{children:"x"}})',
    },
    {
      // Value: protects=an unminified (0,e.jsx)( call gets its mark; fails_when=the wrapped call shape is dropped; why_new=only the .jsx( call was tested; seam=none; no_claim=jsxs or createElement
      example: 'a wrapped jsx call with double quotes',
      input: '(0,e.jsx)("span",{id:"my-placeholder"})',
      output: '(0,e.jsx)("span",{id:"my-placeholder",children:"MARK"})',
    },
    {
      // Value: protects=a template literal or a nested object later in the jsx props stays valid js; fails_when=the children go before the first "}" again; why_new=every jsx row had flat props; seam=none; no_claim=children placed after a nested prop
      example: 'a jsx call with a template literal and a nested object after the id',
      input: `r.jsx("span",{id:"my-placeholder",className:\`v \${c}\`,style:{opacity:.5}})`,
      output: `r.jsx("span",{id:"my-placeholder",children:"MARK",className:\`v \${c}\`,style:{opacity:.5}})`,
    },
    {
      // Value: protects=a ">" inside a later attribute value does not end the tag; fails_when=the tag end is the first ">" again; why_new=no row had a ">" in an attribute value; seam=none; no_claim=unquoted attribute values
      example: 'an element with a > inside a later attribute value',
      input: '<span id="my-placeholder" x-show="count > 0">old</span>',
      output: '<span id="my-placeholder" x-show="count > 0">MARK</span>',
    },
    {
      // Value: protects=a ">" inside a single quoted attribute value does not end the tag; fails_when=tagEnd only tracks double quotes; why_new=the x-show row only has a double quoted value; seam=none; no_claim=unquoted attribute values
      example: 'an element with a > inside a later single quoted attribute value',
      input: `<span id="my-placeholder" x-show='count > 0'>old</span>`,
      output: `<span id="my-placeholder" x-show='count > 0'>MARK</span>`,
    },
    {
      example: 'a jsx call already marked by a previous run',
      input: 'r.jsx("b",{id:"my-placeholder",children:"OLD"})',
      output: 'r.jsx("b",{id:"my-placeholder",children:"MARK"})',
    },
    {
      example: 'a jsx call with two arguments before its props',
      input: 'r.jsx("a","b",{id:"my-placeholder"})',
      output: 'r.jsx("a","b",{id:"my-placeholder"})',
    },
    {
      example: 'a props object outside a jsx call then a jsx call',
      input: '{id:"my-placeholder"} r.jsx("d",{id:"my-placeholder"})',
      output: '{id:"my-placeholder"} r.jsx("d",{id:"my-placeholder",children:"MARK"})',
    },
  ]

  it.each(injectMarkTests)('injectMark $example', ({ input, output }) => {
    const result = injectMark(input, 'my-placeholder', 'MARK')
    expect(result).toBe(output)
  })

  it('countPlaceholders counts the placeholder-shaped usages only', () => {
    expect(countPlaceholders('__my-placeholder__ {{ my-placeholder }} <span id="my-placeholder"></span> <meta name="my-placeholder" content="">', 'my-placeholder')).toBe(4)
    expect(countPlaceholders(`createElement('span', { id: 'my-placeholder' }) {my-placeholder}`, 'my-placeholder')).toBe(1)
    expect(countPlaceholders('the my.placeholder word and __myXplaceholder__', 'my.placeholder')).toBe(0)
    expect(countPlaceholders(`document.querySelector('meta[name="my-placeholder"]')`, 'my-placeholder')).toBe(0)
    // a minifier like rolldown quotes the jsx props with backticks
    expect(countPlaceholders('(0,e.jsx)(`span`,{id:`my-placeholder`})', 'my-placeholder')).toBe(1)
  })

  it('injectMark stays linear on a big minified chunk', () => {
    // a regex starting at every "<" took about a minute on this chunk, beyond the test timeout
    const chunk = `${'for(var i=0;i<a.length;i++){x+=1};'.repeat(40_000)}<span id="my-placeholder"></span>r.jsx("b",{id:"my-placeholder"})`
    const result = injectMark(chunk, 'my-placeholder', 'MARK')
    expect(result.endsWith('<span id="my-placeholder">MARK</span>r.jsx("b",{id:"my-placeholder",children:"MARK"})')).toBe(true)
  })

  it.each(injectMarkTests)('injectMark $example keeps a dollar sign in the mark as is', ({ input, output }) => {
    const mark = 'v$1 $& $$'
    expect(injectMark(input, 'my-placeholder', mark)).toBe(output.replaceAll('MARK', () => mark))
  })
})
