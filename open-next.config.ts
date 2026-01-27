export default {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      queue: "direct",
      incrementalCache: "dummy",
      tagCache: "dummy",
    },
  },

  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },

  dangerous: {
    enableCacheInterception: false,
  },
};
