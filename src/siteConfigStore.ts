import { cmsDataFirst, listEndpointBuilder } from "./services/cms";

export type SiteConfig = {
  name: string;
  email: string;
  aboutMe: string;
  socials: {
    display: string;
    icon: string;
    url: string;
  }[];
}

let _siteConfigStore = await cmsDataFirst<SiteConfig>(listEndpointBuilder('site_config', {
  pageSize: 1, expand: ['socials'], filter: "configName='evanlihou.com'",
  fields: ['name', 'email', 'aboutMe', 'socials', 'expand.socials.{id,display,url,icon}']
}));
if (_siteConfigStore == null) throw new Error("Did not find a site config");

// Global information to be used at build time
export const siteConfigStore = {
  set: (newValue: SiteConfig) => {
    _siteConfigStore = newValue;
  },
  get: () => _siteConfigStore as SiteConfig,
};
