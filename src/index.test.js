import extension from "./index";
import { context, version, screens, components } from "./fixtures";

describe("Colors", () => {
    it("should generate code snippet", () => {
        const code = extension.colors(context);
        return expect(Promise.resolve(code)).resolves.toMatchSnapshot();
    });

    it("should generate exportable file", () => {
        const code = extension.exportColors(context);
        return expect(Promise.resolve(code)).resolves.toMatchSnapshot();
    });
});

describe("Text Styles", () => {
    it("should generate code snippet", () => {
        const code = extension.textStyles(context);
        return expect(Promise.resolve(code)).resolves.toMatchSnapshot();
    });

    it("should generate exportable file", () => {
        const code = extension.exportTextStyles(context);
        return expect(Promise.resolve(code)).resolves.toMatchSnapshot();
    });
});

version.layers.map(layer => {
    describe(`Layer \`${layer.name}\``, () => {
        it("should generate code snippet", async () => {
            const code = extension.layer(context, layer, version);
            return expect(Promise.resolve(code)).resolves.toMatchSnapshot();
        });
    });
});