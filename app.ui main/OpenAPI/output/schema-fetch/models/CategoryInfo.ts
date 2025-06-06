/* tslint:disable */
/* eslint-disable */
/**
 * Edison Backend API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * List the supported genres and audiences
 * @export
 * @interface CategoryInfo
 */
export interface CategoryInfo {
    /**
     * 
     * @type {Array<string>}
     * @memberof CategoryInfo
     */
    genres: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CategoryInfo
     */
    audiences: Array<string>;
}

/**
 * Check if a given object implements the CategoryInfo interface.
 */
export function instanceOfCategoryInfo(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "genres" in value;
    isInstance = isInstance && "audiences" in value;

    return isInstance;
}

export function CategoryInfoFromJSON(json: any): CategoryInfo {
    return CategoryInfoFromJSONTyped(json, false);
}

export function CategoryInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CategoryInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'genres': json['genres'],
        'audiences': json['audiences'],
    };
}

export function CategoryInfoToJSON(value?: CategoryInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'genres': value.genres,
        'audiences': value.audiences,
    };
}

