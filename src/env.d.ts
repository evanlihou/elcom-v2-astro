/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_CMS_BASE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}