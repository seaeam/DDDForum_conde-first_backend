import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  typescript: true,
  rules: {
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'style/brace-style': 'off',
    'no-console': 'off',
  },
})
