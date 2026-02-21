import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../pkg/server/api/console/v1/schema.graphql",
  documents: ["src/**/*.ts"],
  generates: {
    "./src/client/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        rawRequest: true,
        enumsAsTypes: true,
        scalars: {
          ID: "string",
          DateTime: "string",
          Upload: "File",
        },
      },
    },
  },
};

export default config;
