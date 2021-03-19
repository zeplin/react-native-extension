function lowercaseFirst(s) {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

function uppercaseFirst(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function joinTokens(components, namingScheme) {
    switch (namingScheme) {
        case "constant":
            return components.map(val => val.toUpperCase()).join("_");
        case "snake":
            return components.join("_");
        case "pascal":
            return components.map(uppercaseFirst).join("");
        default:
        case "camel":
            return lowercaseFirst(components.map(uppercaseFirst).join(""));
    }
}

function tokensForString(str) {
    var tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

    var matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(function (token) {
        return token.toLowerCase();
    });
}

export function generateName(name, namingScheme) {
    if (namingScheme === "none") {
        return name.match(/^[A-Za-z_][A-Za-z_0-9]*$/) ? name : `${JSON.stringify(name)}`;
    }
    return joinTokens(tokensForString(name), namingScheme);
}
