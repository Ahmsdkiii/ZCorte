import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "desain/**",
      "asset/**",
      "scripts/**",
      "*.tsbuildinfo",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message: "Komponen UI dan ViewModel dilarang mengimpor Prisma Client langsung.",
            },
          ],
          patterns: [
            {
              group: ["@/server/*"],
              message:
                "Komponen UI dan ViewModel dilarang mengimpor modul server; gunakan Server Action, Route Handler, atau props dari Server Component.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/models/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message: "src/models/ berisi domain murni dan tidak boleh bergantung pada React.",
            },
            {
              name: "react-dom",
              message: "src/models/ berisi domain murni dan tidak boleh bergantung pada React DOM.",
            },
            {
              name: "next",
              message: "src/models/ berisi domain murni dan tidak boleh bergantung pada Next.js.",
            },
            {
              name: "@prisma/client",
              message: "src/models/ tidak boleh bergantung pada Prisma Client.",
            },
          ],
          patterns: [
            {
              group: ["next/*", "@/server/*"],
              message:
                "src/models/ berisi domain murni dan tidak boleh mengimpor Next.js atau modul server.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
