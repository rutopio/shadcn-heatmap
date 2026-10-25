import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { calendarProps } from "../src/docs/calendar/props";
import { dateProps } from "../src/docs/date/props";
import { statusProps } from "../src/docs/status/props";
import { weekdayProps } from "../src/docs/weekday/props";

for (const [slug, sections] of [
  ["calendar", calendarProps],
  ["date", dateProps],
  ["weekday", weekdayProps],
  ["status", statusProps],
] as const) {
  test(`${slug}: Props reference covers custom props, required flags and documented defaults`, () => {
    const source = ts.createSourceFile(
      "component.tsx",
      readFileSync(
        new URL(
          `../src/components/heatmap/${slug}-heatmap.tsx`,
          import.meta.url,
        ),
        "utf8",
      ),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    for (const section of sections) {
      const declaration = source.statements.find(
        (node): node is ts.TypeAliasDeclaration =>
          ts.isTypeAliasDeclaration(node) &&
          node.name.text === `${section.componentName}Props`,
      );
      assert.ok(declaration, `${section.componentName} has a props type`);
      const types = ts.isIntersectionTypeNode(declaration.type)
        ? declaration.type.types
        : [declaration.type];
      const members = types.flatMap((node) =>
        ts.isTypeLiteralNode(node) ? [...node.members] : [],
      );
      for (const member of members) {
        if (!ts.isPropertySignature(member)) continue;
        const name = member.name.getText(source);
        const documented = section.props.find((prop) => prop.name === name);
        assert.ok(documented, `${section.componentName}.${name} is documented`);
        assert.equal(
          documented.required ?? false,
          !member.questionToken,
          `${section.componentName}.${name} required flag`,
        );
      }
      const component = source.statements
        .filter(ts.isVariableStatement)
        .flatMap((node) => [...node.declarationList.declarations])
        .find((node) => node.name.getText(source) === section.componentName);
      assert.ok(
        component?.initializer && ts.isArrowFunction(component.initializer),
      );
      const binding = component.initializer.parameters[0].name;
      assert.ok(ts.isObjectBindingPattern(binding));
      for (const prop of section.props) {
        if (prop.default === undefined) continue;
        const parameter: ts.BindingElement | undefined = binding.elements.find(
          (node) =>
            (node.propertyName ?? node.name).getText(source) === prop.name,
        );
        assert.ok(
          parameter?.initializer,
          `${section.componentName}.${prop.name} has a default`,
        );
        const actual = parameter.initializer.getText(source);
        const value: unknown = ts.isStringLiteral(parameter.initializer)
          ? parameter.initializer.text
          : JSON.parse(actual);
        assert.deepEqual(
          JSON.parse(prop.default),
          value,
          `${section.componentName}.${prop.name} default matches`,
        );
      }
    }
    const labelsType = source.statements.find(
      (node): node is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(node) &&
        node.name.text ===
          (slug === "calendar"
            ? "Labels"
            : `${sections[0].componentName}Labels`),
    );
    assert.ok(labelsType && ts.isTypeLiteralNode(labelsType.type));
    const description = sections[0].props.find(
      (prop) => prop.name === "labels",
    )?.description;
    assert.ok(description);
    for (const member of labelsType.type.members) {
      assert.ok(
        member.name && description.includes(member.name.getText(source)),
        "Every label option is documented",
      );
    }
  });
}

test("the documented Date peak example handles all-negative input", () => {
  const description = dateProps
    .find((section) => section.componentName === "DateHeatmapStat")
    ?.props.find((prop) => prop.name === "compute")?.description;
  const example = description?.match(/Example: `([^`]+)`/)?.[1];
  assert.ok(example);
  const compute = runInNewContext(`(${example})`, {}, { timeout: 1000 });
  assert.equal(compute([{ value: -5 }, { value: -2 }]), -2);
});
