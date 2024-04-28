/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_CMS_BASE: string;
  readonly PUBLIC_ASSETS_BASE: string;
  readonly PUBLIC_SITECONFIG?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
