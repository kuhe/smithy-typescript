import { Endpoint, EndpointV2 } from "@smithy/types";

/**
 * Normalize some key of the client config to an async provider.
 * @internal
 *
 * @param configKey - the key to look up in config.
 * @param canonicalEndpointParamKey - this is the name the EndpointRuleSet uses.
 *                                    it will most likely not contain the config
 *                                    value, but we use it as a fallback.
 * @param config - container of the config values.
 *
 * @returns async function that will resolve with the value.
 */
export const createConfigValueProvider = <Config extends Record<string, unknown>>(
  configKey: string,
  canonicalEndpointParamKey: string,
  config: Config
) => {
  const configProvider = async () => {
    const configValue: unknown = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  };
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue: string = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    };
  }

  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue: string = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    };
  }

  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      if (config.isCustomEndpoint === false) {
        return undefined;
      }
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return (endpoint as EndpointV2).url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint as Endpoint;
          // query params are ignored in setting endpoint.
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
};
