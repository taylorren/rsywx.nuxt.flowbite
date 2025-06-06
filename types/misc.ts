// filepath: types/misc.ts
export interface Word {
  word: string;
  meaning: string;
  sentence: string;
  type: string;
}

export interface Qotd {
  id: number;
  quote: string;
  source: string;
}

export interface Weather {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    obsTime: string;
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    dew: string;
  };
  refer: {
    sources: string[];
    license: string[];
  };
}