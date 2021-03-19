import { OPTION_NAMES } from "../constants";
import { getColorStringByFormat } from "./color-utils";
import { generateName } from "./name-utils";

function getLinkedResources(container, type, resource) {
    const isProject = type === "project";
    let resources = [...container[resource]];
    let itContainer = isProject ? container.linkedStyleguide : container.parent;
    while (itContainer) {
        resources = [...resources, ...itContainer[resource]];
        itContainer = itContainer.parent;
    }

    return resources;
}

export class Context {
    constructor(extensionContext) {
        if (extensionContext.styleguide) {
            this.container = extensionContext.styleguide;
            this.type = "styleguide";
        } else {
            this.container = extensionContext.project;
            this.type = "project";
        }

        this.useLinkedStyleguides = extensionContext.getOption(OPTION_NAMES.USE_LINKED_STYLEGUIDES);
        this.colorFormat = extensionContext.getOption(OPTION_NAMES.COLOR_FORMAT);
        this.tokenNameFormat = extensionContext.getOption(OPTION_NAMES.TOKEN_NAME_FORMAT);
        this.defaultValues = extensionContext.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES);
        this.showDimensions = extensionContext.getOption(OPTION_NAMES.SHOW_DIMENSIONS);
        this.densityDivisor = this.container.densityDivisor;
        this.platform = this.container.type;
    }

    getResources(resourceKey) {
        if (this.useLinkedStyleguides) {
            return getLinkedResources(this.container, this.type, resourceKey);
        }

        return this.container[resourceKey];
    }

    getColorValue(color) {
        const matchedColor = this.container.findColorEqual(color, this.useLinkedStyleguides);
        if (matchedColor) {
            const colorName = generateName(matchedColor.originalName || matchedColor.name, this.tokenNameFormat);
            return colorName.startsWith('"') ? `colors[${colorName}]` : `colors.${colorName}`;
        }
        return getColorStringByFormat(color, this.colorFormat);
    }
}
