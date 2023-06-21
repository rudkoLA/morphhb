const SERVER_URL = "/";

const SERVER_URL_DEV = "http://localhost:3004/";

export interface IWord {
  id: string;
  definition: string;
  book: string;
  chapter: number;
  verse: number;
}

const jsonRequest = (url: string, options = {}) => {
  return fetch(url, {
    headers: { "content-type": "application/json" },
    ...options,
  }).then((response) => response.json());
};

export const getRequest = (url: string, o = {}) => {
  const options = {
    method: "GET",
    ...o,
  };

  const req = jsonRequest(url, options);

  return req;
};

export const postRequest = (url: string, data: any) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const req = jsonRequest(url, options);

  return req;
};

export const putRequest = (url: string, data: any) => {
  const options = {
    method: "PUT",
    body: JSON.stringify(data),
  };

  const req = jsonRequest(url, options);

  return req;
};

export const deleteRequest = (url: string, o = {}) => {
  const options = {
    method: "DELETE",
    ...o,
  };

  const req = jsonRequest(url, options);

  return req;
};

export const fetchBook = (book: string) => {
  const req = getRequest(`${SERVER_URL}data\\${book}.json`);

  return req;
};

export const fetchStrongsNumbers = () => {
  // source: https://github.com/eliranwong/unabridged-BDB-Hebrew-lexicon/tree/master
  const req = getRequest(SERVER_URL + "data\\DictBDB.json");

  return req;
};

export const fetchWord = (id: string) => {
  const req = getRequest(`${SERVER_URL_DEV}words/${id}`);

  return req;
};

export const createWord = (word: IWord) => {
  const req = postRequest(SERVER_URL_DEV + "words", word);

  return req;
};

export const updateWord = (word: IWord) => {
  const req = putRequest(`${SERVER_URL_DEV}words/${word.id}`, word);

  return req;
};
