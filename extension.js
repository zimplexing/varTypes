const {
  window: { activeTextEditor: editor },
  commands: { registerCommand }
} = require("vscode");
const _string = require("underscore.string");
const commands = {
  "to var-types or to varTypes": ["dasherize", "camelize"],
  "to varTypes or to VAR_TYPES": ["camelize", "underscored"]
};

const holder = commandName => {
  if (!editor) {
    return;
  }

  editor.edit(builder => {
    let l = editor.selections.length;
    while (l--) {
      let selection = editor.selections[l];
      let stringFunc;
      const text = editor.document.getText(selection);

      switch (commandName) {
        case "to var-types or to varTypes":
          if (text.indexOf("-") > -1) {
            stringFunc = _string[commands[commandName][1]];
          } else {
            stringFunc = _string[commands[commandName][0]];
          }
          break;
        case "to varTypes or to VAR_TYPES":
          if (/^[A-Z_]*$/.test(text)) {
            stringFunc = _string[commands[commandName][0]];
            builder.replace(selection, stringFunc(text.toLocaleLowerCase()));
            return;
          } else {
            stringFunc = _string[commands[commandName][1]];
            builder.replace(selection, stringFunc(text).toLocaleUpperCase());
            return;
          }
      }

      builder.replace(selection, stringFunc(text));
    }
  });
};

exports.activate = context => {
  Object.keys(commands).forEach(commandName => {
    context.subscriptions.push(
      registerCommand(`varTypes.${commandName}`, () => holder(commandName))
    );
  });
};

exports.deactivate = () => {};
