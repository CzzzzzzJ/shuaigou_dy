/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_EDGEDB_INSTANCE_URL: string
  readonly VITE_EDGEDB_SECRET_KEY: string
  readonly VITE_COZE_API_TOKEN: string
  readonly VITE_COZE_WORKFLOW_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
