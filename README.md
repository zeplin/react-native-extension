# Zeplin React Native Extension

Generates React Native JavaScript snippets from colors, text styles and layers. ⚛️📱

## Output

Sample colors output:
```js
const colors = {
  RED: "#ff0000",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
  YELLOW: "#ffff00",
  BLACK: "#000000",
  BLACK_50: "rgba(0, 0, 0, 0.5)",
  WHITE: "#ffffff"
};
```

Sample text style output:
```js
const textStyles = StyleSheet.create({
  SAMPLE_TEXT_STYLE: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left"
  },
  SAMPLE_TEXT_STYLE_WITH_COLOR: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.RED
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
  RED: "hsl(0, 100%, 50%)",
  BLACK_50: "hsla(0, 0%, 0%, 0.5)"
};
```

#### Token name format

Formats the name of colors and text styles. Supports constant case, snake case, camel case, pascal case or no format. Sample colors output as no format:
```js
const colors = {
  red: "#ff0000",
  "black 50": "rgba(0, 0, 0, 0.5)",
};
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## Development

React Native extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create and test extensions.

To learn more about zem, [see documentation](https://github.com/zeplin/zem).
