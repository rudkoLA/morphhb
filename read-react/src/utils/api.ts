const SERVER_URL = "/";

const SERVER_URL_DEV = "http://localhost:3004/";

import { TBookName } from "./books";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postRequest = (url: string, data: any) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const req = jsonRequest(url, options);

  return req;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const fetchWord = (id: string) => {
  const req = getRequest(`${SERVER_URL_DEV}words/${id}`);

  return req;
};

export const fetchWordsByBooksAndChapters = (
  book: TBookName,
  chapter: number
) => {
  const req = getRequest(
    `${SERVER_URL_DEV}words?book=${book}&chapter=${chapter}`
  );

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

export const deleteWord = (word: IWord) => {
  const req = deleteRequest(`${SERVER_URL_DEV}words/${word.id}`);

  return req;
};
