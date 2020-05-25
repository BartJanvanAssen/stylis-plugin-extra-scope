export default function createExtraScopePlugin(...extra) {
  const scopes = extra.map(scope => `${scope.trim()} `)
  const seen = new WeakSet()

  const extraScopePlugin = (
    context,
    content,
    selectors,
    parents,
    line,
    column,
    length,
    type,
  ) => {
    if (context !== 2 || type === 107 || seen.has(selectors)) return

    seen.add(selectors)

    for (let i = 0; i < selectors.length; i++) {
      selectors[i] = scopes
        .map(scope => {
        // Avoid to apply scope twice to the selector to prevent issues
        // #my-scope #my-scope .some-class span
          const s = selectors[i]
          if (s && s.indexOf(scope) >= 0) {
            return s
          }
          return `${scope}${s}`
        })
        .join(',')
    }
  }

  return extraScopePlugin
}
