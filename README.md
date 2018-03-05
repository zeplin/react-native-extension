# Zeplin React Native Extension

Generates React Native JavaScript snippets from colors, text styles and layers. ⚛️📱

Sample colors output:
```js
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  yellow: "#ffff00",
  black: "#000000",
  black50: "rgba(0, 0, 0, 0.5)",
  white: "#ffffff"
};
```

Sample text style output:
```js
const textStyles = StyleSheet.create({
  sampleTextStyle: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left"
  },
  sampleTextStyleWithColor: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.red
  }
});
```

Sample layer output:
```js
const layerWithShadow = {
  width: 100,
  height: 100,
  shadowColor: colors.black50,
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 4,
  shadowOpacity: 1
};
```

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:
```js
const colors = {
  red: "hsl(0, 100%, 50%)",
  black50: "hsla(0, 0%, 0%, 0.5)"
};
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## Development

To debug the extension, run `dev-server` script:

```sh
npm install
npm run dev-server
```

This will serve the manifest and module files locally, which you can add to a Zeplin project, following the [tutorial](https://github.com/zeplin/zeplin-extension-documentation/blob/master/tutorial.md#adding-a-local-extension).

*We're currently working on an extension manager to quickly create and test Zeplin extensions with no build configuration. React Native extension should be updated soon to make use of this manager.*
