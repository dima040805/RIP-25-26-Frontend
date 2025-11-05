/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApitypesPlanetJSON {
  description?: string;
  discovery?: number;
  distance?: number;
  id?: number;
  image?: string;
  is_delete?: boolean;
  mass?: number;
  name?: string;
  star_radius?: number;
}

export interface ApitypesPlanetsResearchJSON {
  id?: number;
  planet_id?: number;
  planet_radius?: number;
  planet_shine?: number;
  research_id?: number;
}

export interface ApitypesResearchJSON {
  creator_login?: string;
  date_create?: string;
  date_finish?: string;
  date_form?: string;
  date_research?: string;
  id?: number;
  moderator_login?: string;
  status?: string;
}

export interface ApitypesStatusJSON {
  status?: string;
}

export interface ApitypesUserJSON {
  id?: string;
  is_moderator?: boolean;
  login?: string;
  password?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Astronomy Research API
 * @version 1.0
 * @contact
 *
 * API для управления астрономическими исследованиями планет
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  planet = {
    /**
     * @description Создает новую планету и возвращает её данные
     *
     * @tags planets
     * @name CreatePlanetCreate
     * @summary Создать новую планету
     * @request POST:/planet/create-planet
     * @secure
     */
    createPlanetCreate: (
      planet: ApitypesPlanetJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPlanetJSON, Record<string, string>>({
        path: `/planet/create-planet`,
        method: "POST",
        body: planet,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о планете по её идентификаторуqqqq
     *
     * @tags planets
     * @name PlanetDetail
     * @summary Получить планету по ID
     * @request GET:/planet/{id}
     */
    planetDetail: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesPlanetJSON, Record<string, string>>({
        path: `/planet/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет планету в черновик исследования пользователя
     *
     * @tags planets
     * @name AddToResearchCreate
     * @summary Добавить планету в исследование
     * @request POST:/planet/{id}/add-to-research
     * @secure
     */
    addToResearchCreate: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesResearchJSON, Record<string, string>>({
        path: `/planet/${id}/add-to-research`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о планете по ID
     *
     * @tags planets
     * @name ChangePlanetUpdate
     * @summary Изменить данные планеты
     * @request PUT:/planet/{id}/change-planet
     * @secure
     */
    changePlanetUpdate: (
      id: number,
      planet: ApitypesPlanetJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPlanetJSON, Record<string, string>>({
        path: `/planet/${id}/change-planet`,
        method: "PUT",
        body: planet,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для планеты и возвращает обновленные данные
     *
     * @tags planets
     * @name CreateImageCreate
     * @summary Загрузить изображение для планеты
     * @request POST:/planet/{id}/create-image
     * @secure
     */
    createImageCreate: (
      id: number,
      data: {
        /** Изображение планеты */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/planet/${id}/create-image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление планеты по ID
     *
     * @tags planets
     * @name DeletePlanetDelete
     * @summary Удалить планету
     * @request DELETE:/planet/{id}/delete-planet
     * @secure
     */
    deletePlanetDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/planet/${id}/delete-planet`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  planets = {
    /**
     * @description Возвращает все планеты или фильтрует по названию
     *
     * @tags planets
     * @name PlanetsList
     * @summary Получить список планет
     * @request GET:/planets
     */
    planetsList: (
      query?: {
        /** Название планеты для поиска */
        planet_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPlanetJSON[], Record<string, string>>({
        path: `/planets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  planetsResearch = {
    /**
     * @description Обновляет параметры планеты в конкретном исследовании
     *
     * @tags planets-research
     * @name PlanetsResearchUpdate
     * @summary Изменить данные планеты в исследовании
     * @request PUT:/planets_research/{planet_id}/{research_id}
     * @secure
     */
    planetsResearchUpdate: (
      planetId: number,
      researchId: number,
      data: ApitypesPlanetsResearchJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPlanetsResearchJSON, Record<string, string>>({
        path: `/planets_research/${planetId}/${researchId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет связь планеты и исследования
     *
     * @tags planets-research
     * @name PlanetsResearchDelete
     * @summary Удалить планету из исследования
     * @request DELETE:/planets_research/{planet_id}/{research_id}
     * @secure
     */
    planetsResearchDelete: (
      planetId: number,
      researchId: number,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesResearchJSON, Record<string, string>>({
        path: `/planets_research/${planetId}/${researchId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  research = {
    /**
     * @description Возвращает информацию о текущем черновике исследования пользователя
     *
     * @tags researches
     * @name ResearchCartList
     * @summary Получить корзину исследования
     * @request GET:/research/research-cart
     * @secure
     */
    researchCartList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/research/research-cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию об исследовании включая планеты
     *
     * @tags researches
     * @name ResearchDetail
     * @summary Получить исследование по ID
     * @request GET:/research/{id}
     * @secure
     */
    researchDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/research/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные исследования
     *
     * @tags researches
     * @name ChangeResearchUpdate
     * @summary Изменить исследование
     * @request PUT:/research/{id}/change-research
     * @secure
     */
    changeResearchUpdate: (
      id: number,
      research: ApitypesResearchJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesResearchJSON, Record<string, string>>({
        path: `/research/${id}/change-research`,
        method: "PUT",
        body: research,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление исследования
     *
     * @tags researches
     * @name DeleteResearchDelete
     * @summary Удалить исследование
     * @request DELETE:/research/{id}/delete-research
     * @secure
     */
    deleteResearchDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/research/${id}/delete-research`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Изменяет статус исследования (только для модераторов)
     *
     * @tags researches
     * @name FinishUpdate
     * @summary Модерировать исследование
     * @request PUT:/research/{id}/finish
     * @secure
     */
    finishUpdate: (
      id: number,
      status: ApitypesStatusJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesResearchJSON, Record<string, string>>({
        path: `/research/${id}/finish`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит исследование в статус "formed"
     *
     * @tags researches
     * @name FormUpdate
     * @summary Сформировать исследование
     * @request PUT:/research/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesResearchJSON, Record<string, string>>({
        path: `/research/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  researches = {
    /**
     * @description Возвращает исследования с возможностью фильтрации по датам и статусу
     *
     * @tags researches
     * @name ResearchesList
     * @summary Получить список исследований
     * @request GET:/researches
     * @secure
     */
    researchesList: (
      query?: {
        /** Начальная дата (YYYY-MM-DD) */
        "from-date"?: string;
        /** Конечная дата (YYYY-MM-DD) */
        "to-date"?: string;
        /** Статус исследования */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesResearchJSON[], Record<string, string>>({
        path: `/researches`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Принимает логин/пароль, возвращает jwt-токен в формате {"token":"..."}.
     *
     * @tags users
     * @name SignInCreate
     * @summary Вход (получение токена)
     * @request POST:/users/sign-in
     */
    signInCreate: (credentials: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/sign-in`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет токен текущего пользователя из хранилища. Возвращает {"status":"signed_out"}.
     *
     * @tags users
     * @name SignOutCreate
     * @summary Выход (удаление токена)
     * @request POST:/users/sign-out
     * @secure
     */
    signOutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/sign-out`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрирует нового пользователя. Возвращает URL созданного ресурса в Location и тело созданного пользователя.
     *
     * @tags users
     * @name SignUpCreate
     * @summary Регистрация пользователя
     * @request POST:/users/sign-up
     */
    signUpCreate: (user: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/sign-up`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные профиля (доступен только тот, чей UUID совпадает с user_id в токене).
     *
     * @tags users
     * @name ProfileList
     * @summary Получить профиль пользователя
     * @request GET:/users/{login}/profile
     * @secure
     */
    profileList: (login: string, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/${login}/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет профиль пользователя (может делать только сам пользователь).
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Изменить профиль пользователя
     * @request PUT:/users/{login}/profile
     * @secure
     */
    profileUpdate: (
      login: string,
      user: ApitypesUserJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/${login}/profile`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
