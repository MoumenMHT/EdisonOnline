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
 * 
 * @export
 * @interface Recommendation
 */
export interface Recommendation {
    /**
     * 
     * @type {string}
     * @memberof Recommendation
     */
    message: string;
}

/**
 * Check if a given object implements the Recommendation interface.
 */
export function instanceOfRecommendation(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "message" in value;

    return isInstance;
}

export function RecommendationFromJSON(json: any): Recommendation {
    return RecommendationFromJSONTyped(json, false);
}

export function RecommendationFromJSONTyped(json: any, ignoreDiscriminator: boolean): Recommendation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'message': json['message'],
    };
}

export function RecommendationToJSON(value?: Recommendation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'message': value.message,
    };
}

