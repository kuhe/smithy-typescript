import { EndpointV2 } from "@smithy/types";

import { debugId, toDebugString } from "./debug";
import { EndpointError, EndpointResolverOptions, RuleSetObject } from "./types";
import { evaluateRules } from "./utils";

/**
 * Resolves an endpoint URL by processing the endpoints ruleset and options.
 */
export const resolveEndpoint = (ruleSetObject: RuleSetObject, options: EndpointResolverOptions): EndpointV2 => {
  const { endpointParams, logger } = options;
  const { parameters, rules } = ruleSetObject;

  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);

  // @ts-ignore Type 'undefined' is not assignable to type 'string | boolean' (2322)
  const paramsWithDefault: [string, string | boolean][] = Object.entries(parameters)
    .filter(([, v]) => v.default != null)
    .map(([k, v]) => [k, v.default]);

  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }

  const requiredParams = Object.entries(parameters)
    .filter(([, v]) => v.required)
    .map(([k]) => k);

  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }

  const endpoint = evaluateRules(rules, { endpointParams, logger, referenceRecord: {} });

  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);

  return endpoint;
};
