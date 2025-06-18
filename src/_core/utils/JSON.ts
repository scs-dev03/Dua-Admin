export const json_utils = {
  stringify: (obj: any) => {
    return JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? `${v}n` : v
    ).replace(/"(-?\d+)n"/g, (_, a) => a);
  },
};
