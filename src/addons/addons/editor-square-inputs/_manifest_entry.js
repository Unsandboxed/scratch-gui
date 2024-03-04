/* generated by pull.js */
const manifest = {
  "editorOnly": true,
  "noTranslations": true,
  "name": "Square block inputs",
  "description": "Makes certain block input types (such as text or color) rectangular instead of round, like in Scratch 2.0.",
  "credits": [
    {
      "name": "CST1229",
      "link": "https://scratch.mit.edu/users/CST1229/"
    }
  ],
  "tags": [
    "theme"
  ],
  "enabledByDefault": true,
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "settings": [
    {
      "dynamic": true,
      "name": "Text inputs",
      "id": "text",
      "type": "boolean",
      "default": true
    },
    {
      "dynamic": true,
      "name": "Color inputs",
      "id": "color",
      "type": "boolean",
      "default": true
    },
    {
      "name": "Number inputs",
      "id": "number",
      "type": "boolean",
      "default": false
    }
  ],
  "tags": [
  ],
  "dynamicDisable": true
};
export default manifest;
