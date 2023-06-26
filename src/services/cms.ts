type CmsSearchResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[]
}

type ListEndpointBuilderOpts = {
  pageSize?: number;
  filter?: string;
  expand?: string[];
  fields?: string[];
  sort?: string[];
}
export function listEndpointBuilder(collection: string, opt: ListEndpointBuilderOpts): string {
  let endpoint = `/collections/${collection}/records`;
  const queryParams: string[] = [];
  if (opt.pageSize) queryParams.push(`perPage=${opt.pageSize}`);
  if (opt.filter) queryParams.push(`filter=(${opt.filter})`);
  if (opt.expand) queryParams.push(`expand=${opt.expand.join(',')}`);
  if (opt.sort) queryParams.push(`sort=${opt.sort.join(',')}`);
  if (opt.fields && opt.fields.length > 0) {
    let filterFields: string[] = [];
    opt.fields.forEach(field => {
      // Only supports one expansion per entry
      const expansionMatches = /(.*){(.*)}(.*)/g.exec(field);
      if (expansionMatches == null) {
        filterFields.push(field);
        return;
      }
      const expanded = expansionMatches[2].split(',');
      expanded.forEach(element => {
        filterFields.push(expansionMatches[1] + element + expansionMatches[3]);
      });
    });
    queryParams.push(`fields=${filterFields.join(',')}`);
  }


  if (queryParams.length > 0) {
    endpoint += '?' + queryParams.join('&');
  }

  return endpoint;
}

export async function cmsData<T>(endpoint: string): Promise<CmsSearchResponse<T>> {
  const response = await fetch(`${import.meta.env.PUBLIC_CMS_BASE}${endpoint}`);
  if (!response.ok) throw new Error(`Failed to fetch from CMS: ${response.status} - ${await response.text()}`);

  let json = await response.json();
  // If we have any expands, replace them in the actual data
  json.items = json.items.map((item: any) => {
    if (!('expand' in item)) return item;
    // TODO: Maybe we don't need the find and replace?
    Object.keys(item.expand).map(key => {
      if (Array.isArray(item[key])) {
        for (let i = 0; i < item[key].length; i++) {
          const expandedItem = item.expand[key].find((e: any) => e.id === item[key][i]);
          item[key][i] = expandedItem ?? undefined; // item[key][i];
        }
      } else {
        const expandedItem = item.expand[key].find((e: any) => e.id === item[key]);
        item[key] = expandedItem ?? item[key];
      }
      delete item.expand[key];
    });

    return item;
  });
  return json as CmsSearchResponse<T>;
}

export async function cmsDataFirst<T>(endpoint: string): Promise<T | null> {
  const cmsResponse = await cmsData<T>(endpoint);
  if (!cmsResponse?.items || cmsResponse.items.length == 0) return null;
  return cmsResponse.items[0];
}

export type BaseCmsItem = {
  collectionId: string;
  id: string;
  [field: string]: string;
}
export function getImageUrl(item: BaseCmsItem, fieldName: string, thumb: string | null = null) {
  if (!item.collectionId || !item.id) throw new Error("collectionId and id must be fetched to get file URLs")
  let endpoint = `${import.meta.env.PUBLIC_ASSETS_BASE}/files/${item.collectionId}/${item.id}/${item[fieldName]}`;
  if (thumb) endpoint += `?thumb=${thumb}`;
  return endpoint;
}

export default cmsData;
