/* eslint-env node */
module.exports = {
    extends: "@zeplin/eslint-config",
    globals: {
        "Intl": true
    },
    rules: {
        "no-magic-numbers": [
            "warn",
            {
                "ignore": [-1, 0, 1]
            }
        ]
    }
}