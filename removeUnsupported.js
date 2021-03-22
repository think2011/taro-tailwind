const postcss = require("postcss");
const remRE = /-?\d?\.?\d+\s*rem/g;

function isSupportedProperty(prop, val = null) {
  const rules = supportedProperties[prop];
  if (!rules) return false;

  if (val) {
    // if (val.endsWith('vh') || val.endsWith('vw') || val.endsWith('em')) {
    //   return false
    // }

    if (Array.isArray(rules)) {
      return rules.includes(val);
    }
  }

  return true;
}

function isSupportedRule(selector) {
  if (
    selector.includes("*") ||
    selector.includes(":hover") ||
    selector.includes(":focus") ||
    selector.includes(":not([hidden]) ~ :not([hidden])")
  ) {
    return false;
  }

  return true;
}

function isPlaceholderPseudoSelector(selector) {
  return selector.includes("::placeholder");
}

module.exports = postcss.plugin("postcss-taro-tailwind", (options = {}) => {
  return (root) => {
    root.walkRules((rule) => {
      if (rule.parent.name === "media") {
        rule.parent.remove();
        return;
      }

      if (!isSupportedRule(rule.selector)) {
        rule.remove();
        return;
      }

      if (isPlaceholderPseudoSelector(rule.selector)) {
        const placeholderSelectors = [];
        rule.selectors.forEach((selector) => {
          if (isPlaceholderPseudoSelector(selector)) {
            placeholderSelectors.push(selector.replace(/::placeholder/g, ""));
          }
        });
        if (placeholderSelectors.length) {
          rule.selectors = placeholderSelectors;
          rule.walkDecls((decl) => {
            if (decl.prop === "color") {
              decl.replaceWith(decl.clone({ prop: "placeholder-color" }));
            }
          });
        }
        // rule.selector.replace('::placeholder', '')
      }

      if (rule.selector.includes("\\/")) {
        rule.selector = rule.selector.replace("\\/", "_");
      }

      if (rule.selector.includes("\\.")) {
        rule.selector = rule.selector.replace("\\.", "d");
      }

      rule.walkDecls((decl) => {
        if (decl.prop === "visibility") {
          switch (decl.value) {
            case "hidden":
              decl.replaceWith(decl.clone({ value: "collapse" }));
              return;
          }
        }

        if (decl.prop === "vertical-align") {
          switch (decl.value) {
            case "middle":
              decl.replaceWith(decl.clone({ value: "center" }));
              return;
          }
        }

        // allow using rem values (default unit in tailwind)
        if (decl.value.includes("rem")) {
          decl.value = decl.value.replace(remRE, (match, offset, value) => {
            const converted = "" + parseFloat(match) * 16 + "px";

            options.debug &&
              console.log("replacing rem value", {
                match,
                offset,
                value,
                converted,
              });

            return converted;
          });
          options.debug &&
            console.log({
              final: decl.value,
            });
        }

        if (
          !decl.prop.startsWith("--") &&
          !isSupportedProperty(decl.prop, decl.value)
        ) {
          // options.debug && console.log('removing ', decl.prop, decl.value)
          decl.remove();
        }
      });
    });
  };
});

const supportedProperties = {
  "align-content": true,
  "align-items": true,
  "align-self": true,
  "animation": true,
  "appearance": true,
  "background": true,
  "background-attachment": true,
  "background-clip": true,
  "background-color": true,
  "background-image": true,
  "background-position": true,
  "background-repeat": ["repeat", "repeat-x", "repeat-y", "no-repeat"],
  "background-size": true,
  "bg-clip-content": true,
  "border-bottom-color": true,
  "border-bottom-left-radius": true,
  "border-bottom-right-radius": true,
  "border-bottom-width": true,
  "border-collapse": true,
  "border-color": true,
  "border-left-color": true,
  "border-left-width": true,
  "border-radius": true,
  "border-right-color": true,
  "border-right-width": true,
  "border-style": true,
  "border-top-color": true,
  "border-top-left-radius": true,
  "border-top-right-radius": true,
  "border-top-width": true,
  "border-width": true,
  "bottom": true,
  "box-shadow": true,
  "box-sizing": true,
  "clear": true,
  "clip": true,
  "clip-path": true,
  "color": true,
  "column-gap": true,
  "cursor": true,
  "display": true,
  "fill": true,
  "flex": true,
  "flex-direction": true,
  "flex-grow": true,
  "flex-shrink": true,
  "flex-wrap": true,
  "float": true,
  "font": true,
  "font-family": true,
  "font-size": true,
  "font-style": ["italic", "normal"],
  "font-variant-numeric": true,
  "font-weight": true,
  "gap": true,
  "grid-auto-columns": true,
  "grid-auto-flow": true,
  "grid-auto-rows": true,
  "grid-column": true,
  "grid-column-end": true,
  "grid-column-start": true,
  "grid-row": true,
  "grid-row-end": true,
  "grid-row-start": true,
  "grid-template-columns": true,
  "grid-template-rows": true,
  "height": true,
  "horizontal-align": ["left", "center", "right", "stretch"],
  "justify-content": true,
  "justify-items": true,
  "justify-self": true,
  "left": true,
  "letter-spacing": true,
  "line-height": true,
  "list-style-position": true,
  "list-style-type": true,
  "margin": true,
  "margin-bottom": true,
  "margin-left": true,
  "margin-right": true,
  "margin-top": true,
  "max-height": true,
  "max-width": true,
  "min-height": true,
  "min-width": true,
  "object-fit": true,
  "object-position": true,
  "opacity": true,
  "order": true,
  "outline": true,
  "outline-offset": true,
  "overflow": true,
  "overflow-wrap": true,
  "overflow-x": true,
  "overflow-y": true,
  "overscroll-behavior": true,
  "overscroll-behavior-x": true,
  "overscroll-behavior-y": true,
  "padding": true,
  "padding-bottom": true,
  "padding-left": true,
  "padding-right": true,
  "padding-top": true,
  "place-content": true,
  "place-items": true,
  "place-self": true,
  "placeholder-color": true,
  "pointer-events": true,
  "position": true,
  "resize": true,
  "right": true,
  "row-gap": true,
  "scale": true,
  "skew": true,
  "stroke": true,
  "stroke-width": true,
  "table-layout": true,
  "text-align": ["left", "center", "right"],
  "text-decoration": ["none", "line-through", "underline"],
  "text-overflow": true,
  "text-transform": ["none", "capitalize", "uppercase", "lowercase"],
  "top": true,
  "transform": true,
  "transform-origin": true,
  "transition": true,
  "transition-delay": true,
  "transition-duration": true,
  "transition-property": true,
  "transition-timing-function": true,
  "translate": true,
  "user-select": true,
  "vertical-align": ["top", "center", "bottom", "stretch"],
  "visibility": ["visible", "collapse"],
  "white-space": true,
  "width": true,
  "word-break": true,
  "z-index": true,
};
