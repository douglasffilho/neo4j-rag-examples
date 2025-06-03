/* eslint no-console: off */

export function debug(breakpointName: string): (data: string | object) => string | object {
  return (data: string | object) => {
    console.log('DEBUG:', breakpointName, JSON.stringify({ data }, null, 2));

    return data;
  };
}
