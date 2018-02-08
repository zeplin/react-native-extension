function lowercaseFirst(s) {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

function uppercaseFirst(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function joinTokens(components, namingScheme) {
    if (namingScheme === "camelCase" || namingScheme === "upperCamelCase") {
        let name = components.map(uppercaseFirst).join("");
        return namingScheme === "camelCase" ? lowercaseFirst(name) : name;
    } else if (namingScheme === "snakeCase") {
        return components.join("_");
    }
    return components.join("-");
}

function tokensForString(str) {
    let tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

    let matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(function (token) {
        return token.toLowerCase();
    });
}

export function generateName(name, namingScheme) {
    return joinTokens(tokensForString(name), namingScheme);
}