import { DefaultClient, ExtractorFunction } from "rest-resource/dist/client";
import Resource from "rest-resource";
import axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from "axios";

export class PokemonClient extends DefaultClient {
  negotiateContent<T extends typeof Resource>(
    ResourceClass: T
  ): ExtractorFunction<InstanceType<T>> {
    // Should always return a function
    return (response: ResourceResponse<InstanceType<T>>["response"]) => {
      let objects: InstanceType<T>[] = [];
      console.log(response);
      if (Array.isArray(response.data.results)) {
        response.data.results.forEach((attributes: any) =>
          objects.push(new ResourceClass(attributes) as InstanceType<T>)
        );
      } else {
        objects.push(
          new ResourceClass(response.data.results) as InstanceType<T>
        );
      }

      return {
        response,
        resources: objects,
        count: () => response.headers["Pagination-Count"],
        pages: () =>
          Math.ceil(
            response.headers["Pagination-Count"] /
              response.headers["Pagination-Limit"]
          ),
        currentPage: () => response.headers["Pagination-Page"],
        perPage: () => response.headers["Pagination-Limit"],
      } as ResourceResponse<InstanceType<T>>;
    };
  }
}

export interface ResourceResponse<T extends Resource, U extends any = any>
  extends Record<string, any> {
  response: AxiosResponse<U>;
  resources: T[];
  count?: () => number;
  pages?: () => number;
  currentPage?: () => number;
  perPage?: () => number;
  next?: () => Promise<ResourceResponse<T, U>>;
  previous?: () => Promise<ResourceResponse<T, U>>;
}
