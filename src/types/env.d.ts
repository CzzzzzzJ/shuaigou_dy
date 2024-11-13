/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EDGEDB_INSTANCE: string
  readonly VITE_EDGEDB_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    EDGEDB_INSTANCE: string;
    EDGEDB_SECRET_KEY: string;
  }
} 