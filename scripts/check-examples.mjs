import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const files = new Map();
const parse = (source) =>
  ts.createSourceFile(
    "example.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
const declaredNames = (source) => {
  const names = new Set();
  for (const statement of parse(source).statements) {
    if (ts.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
    if (ts.isFunctionDeclaration(statement) && statement.name)
      names.add(statement.name.text);
    if (ts.isImportDeclaration(statement)) {
      if (statement.importClause?.name)
        names.add(statement.importClause.name.text);
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings))
        for (const element of bindings.elements) names.add(element.name.text);
    }
  }
  return names;
};

for (const name of ["calendar", "date", "weekday", "status"]) {
  const base = readFileSync(
    path.join(root, `src/examples/${name}.tsx`),
    "utf8",
  );
  const baseAst = parse(base);
  const snippets = [];
  const variants = parse(
    readFileSync(path.join(root, `src/docs/${name}/variants.tsx`), "utf8"),
  );
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(variants) === "code" &&
      ts.isNoSubstitutionTemplateLiteral(node.initializer)
    )
      snippets.push(node.initializer.text);
    ts.forEachChild(node, visit);
  }
  visit(variants);
  if (name !== "status") {
    const binary = parse(
      readFileSync(path.join(root, "src/docs/binary/snippets.ts"), "utf8"),
    );
    for (const statement of binary.statements)
      if (ts.isVariableStatement(statement)) {
        const declaration = statement.declarationList.declarations[0];
        if (
          declaration.name.getText(binary).toLowerCase() ===
            `binary${name}code` &&
          ts.isNoSubstitutionTemplateLiteral(declaration.initializer)
        )
          snippets.push(declaration.initializer.text);
      }
  }
  for (const [index, snippet] of snippets.entries()) {
    const names = declaredNames(snippet);
    const setup = [];
    const calculations = [];
    for (const statement of baseAst.statements) {
      if (ts.isImportDeclaration(statement)) {
        const clause = statement.importClause;
        const bindings = clause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings)) {
          const imports = bindings.elements.filter(
            (element) => !names.has(element.name.text),
          );
          if (imports.length)
            setup.push(
              `import ${clause.isTypeOnly ? "type " : ""}{ ${imports.map((element) => element.getText(baseAst)).join(", ")} } from ${statement.moduleSpecifier.getText(baseAst)};`,
            );
        }
      } else if (ts.isVariableStatement(statement)) {
        if (
          statement.declarationList.declarations.every(
            (declaration) => !names.has(declaration.name.getText(baseAst)),
          )
        )
          setup.push(statement.getText(baseAst));
      } else if (ts.isFunctionDeclaration(statement) && statement.body) {
        for (const child of statement.body.statements)
          if (
            ts.isVariableStatement(child) &&
            child.declarationList.declarations.every(
              (declaration) =>
                !names.has(declaration.name.getText(baseAst)) &&
                new RegExp(`\\b${declaration.name.getText(baseAst)}\\b`).test(
                  snippet,
                ),
            )
          )
            calculations.push(child.getText(baseAst));
      }
    }
    if (!names.has("data")) setup.push("const data = sampleData;");
    const source = `${setup.join("\n")}\n${calculations.join("\n")}\n${snippet}`;
    files.set(path.join(root, `.example-check/${name}-${index}.tsx`), source);
  }
}
const readme = readFileSync(path.join(root, "README.md"), "utf8");
let index = 0;
for (const [, source] of readme.matchAll(/```tsx\n([\s\S]*?)```/g))
  files.set(path.join(root, `.example-check/readme-${index++}.tsx`), source);

const config = ts.readConfigFile(
  path.join(root, "tsconfig.app.json"),
  ts.sys.readFile,
);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
options.noUnusedLocals = false;
options.noUnusedParameters = false;
const host = ts.createCompilerHost(options);
const getSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (filename, languageVersion, onError) =>
  files.has(filename)
    ? ts.createSourceFile(
        filename,
        files.get(filename),
        languageVersion,
        true,
        ts.ScriptKind.TSX,
      )
    : getSourceFile(filename, languageVersion, onError);
const program = ts.createProgram([...files.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (filename) => filename,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else
  console.log(
    `Checked ${files.size} documentation examples against the component types.`,
  );
