type Params = {
  lang: string,
  route: string,
};

export const getLangRouteKey = ({ lang, route }: Params) => {
  return `${lang}-${route}`;
};
