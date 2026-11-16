export default {
  rules: {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "property-no-unknown": true,
    "unit-no-unknown": true,
    "keyframe-block-no-duplicate-selectors": true,
  },
  overrides: [
    {
      files: [
        "src/styles/{smart-search,inline-editor,composer,ledger-interactions,directory-interactions}.css",
      ],
      rules: { "no-duplicate-selectors": true, "selector-max-id": 1 },
    },
  ],
};
