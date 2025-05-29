export function debug(breakpointName: string): (data: string | object) => string | object {
  return (data: string | object) => {
    console.log('DEBUG:', breakpointName, JSON.stringify({ break: data }, null, 2));

    return data;
  };
}
