/**
 * Convert kebab-case to PascalCase
 * @param kebab the kebab-case string like 'dropdown-menu'
 * @param joinChar the character to join the string parts
 * @returns The PascalCase string like 'DropdownMenu'
 */
export function kebabToPascalCase(kebab: string, joinChar = '') {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(joinChar)
}

/**
 * Converts a camelCase string to kebab-case
 * @param camel the camelCase string to convert, like 'myVariableName'
 * @returns The kebab-case version of the input string, like 'my-variable-name'
 */
export function camelToKebabCase(camel: string) {
  return camel
    .replaceAll(/(?<lower>[a-z0-9])(?<upper>[A-Z])/g, '$<lower>-$<upper>')
    .replaceAll(/(?<upper>[A-Z])(?<word>[A-Z][a-z])/g, '$<upper>-$<word>')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase()
}
