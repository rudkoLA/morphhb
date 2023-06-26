import React from "react";
import { throttle } from "lodash";
import { useEffect, useState } from "react";
import "./App.css";
import {
  IWord,
  fetchBook,
  createWord,
  updateWord,
  fetchWord,
  fetchWordsByBooksAndChapters,
} from "./utils/api";

import { TBookName, bookList, bookNamesMap, books } from "./utils/books";
import { generateNumbers, later } from "./utils/common";
import DictionaryDialog from "./components/Dialog";
import Button from "@mui/material/Button";

function App() {
  const [startingBook, startingChapter, startingVerse] = window.location.hash
    .replace("#", "")
    .split("/");
  const [loading, setLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<string[][][][] | null>(null);
  const [book, setBook] = useState<TBookName>(
    startingBook ? (startingBook as TBookName) : "Gen"
  );
  const [chapter, setChapter] = useState<number>(+startingChapter || 1);
  const [selectedWord, setSelectedWord] = useState<IWord | null>(null); // [book, chapter, verse, word
  const handleChapterChange = (chapter: number) => {
    window.location.hash = `#${book}/${chapter}/0`;
    // scroll to correct chapter
    const element = document.getElementById(`${book}-${chapter}-0`);
    if (element) {
      element.scrollIntoView();
    }
  };

  // const chapterData = bookData?.[chapter - 1];
  const bookName = bookNamesMap[book].toLowerCase();

  useEffect(() => {
    setLoading(true);

    const asyncFn = async () => {
      const data: string[][][][] = await fetchBook(bookName);
      setBookData(data);
      setLoading(false);

      // on initial load, scroll to correct chapter
      if (!bookData && startingChapter) {
        await later(1);

        const element = document.getElementById(
          `${book}-${startingChapter}-${startingVerse}`
        );
        if (element) {
          element.scrollIntoView();
        }
      }
    };

    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookName]);

  useEffect(() => {
    fetchWordsByBooksAndChapters(book, +chapter).then((words) => {
      setWords(words);
    });
  }, [book, chapter, selectedWord]);

  const [words, setWords] = useState<IWord[]>([]);

  const chapterCount = +books[book].split(" ")[0];

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookName = e.target.value as TBookName;
    const asyncFn = async () => {
      await later(1);

      setLoading(true);
      setBook(bookName);
      handleChapterChange(1);
    };

    asyncFn();
  };

  const handleScroll = throttle((): void => {
    let done = false;

    if (bookData) {
      bookData.forEach((chapterData, i) => {
        chapterData.forEach((_verseData, j) => {
          const element = document.getElementById(`${book}-${i + 1}-${j + 1}`);
          if (!done && element) {
            const rect = element.getBoundingClientRect();
            if (rect.top > 0 && rect.top < window.innerHeight) {
              window.location.hash = `#${book}/${i + 1}/${j + 1}`;
              done = true;

              setChapter(i + 1);
              // update chapter selector
              const chapterSelector = document.getElementById(
                "chapterSelector"
              ) as HTMLSelectElement;
              if (chapterSelector) {
                chapterSelector.value = `${i + 1}`;
              }
            }
          }
        });
      });
    }
  }, 2000);

  const handleClose = () => {
    setSelectedWord(null);
  };

  const handleSubmit = async (word: IWord) => {
    const data = await fetchWord(word.id);

    if (data.id) {
      await updateWord(word);
    } else {
      await createWord(word);
    }
    setSelectedWord(null);
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div className="selectorWrapper">
          <label>Books</label>
          <select
            onChange={handleBookChange}
            defaultValue={startingBook ? startingBook : "Gen"}
          >
            {bookList.map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="selectorWrapper">
          <label>Chapters</label>
          <select
            onChange={(e) => handleChapterChange(+e.target.value)}
            defaultValue={startingChapter ? startingChapter : 1}
            id="chapterSelector"
          >
            {generateNumbers(chapterCount).map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
        </div>

        <Button variant="contained" className="wordsButton">
          Words: {words.length}
        </Button>
      </div>
      <hr />

      <div className="text" onScroll={handleScroll}>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          bookData &&
          bookData.map((chapterData, i) => (
            <div key={"chapter-" + i} className="chapter">
              <div className="chapterNumber" id={`${book}-${i + 1}-0`}>
                Chapter {i + 1}
              </div>
              {chapterData?.map((verse, j) => (
                <span key={"verse-" + j + book} className="verse">
                  <span
                    className="verseNumber"
                    id={`${book}-${i + 1}-${j + 1}`}
                  >
                    {j + 1}
                  </span>
                  {verse.map((word, k) => (
                    <span key={"word-" + j + book + k}>
                      {" "}
                      <Word
                        data={word}
                        onClick={(e) => {
                          console.log(e, book, i, j, k);
                          setSelectedWord({
                            id: e,
                            definition: "",
                            book,
                            chapter: i + 1,
                            verse: j + 1,
                          } as IWord);
                        }}
                      />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))
        )}
      </div>

      {selectedWord && (
        <>
          <DictionaryDialog
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            word={selectedWord}
          />
        </>
      )}
    </div>
  );
}
interface IWordProps {
  data: string[];
  onClick: (word: string) => void;
}

const Word: React.FC<IWordProps> = ({ data, onClick }) => {
  const [word, code, meaning] = data;
  const handleClick = () => {
    onClick(word);
  };

  if (word.includes("/")) {
    const words = word.split("/");
    const codes = code.split("/");
    const meanings = meaning.split("/");

    const data = words.map((word, i) => [word, codes[i], meanings[i]]);

    return (
      <span className="word-parts">
        {data.map((item, i) => (
          <Word key={"inner-" + item[0] + i} data={item} onClick={onClick} />
        ))}
      </span>
    );
  }

  return (
    <span key={word} className="word" onClick={handleClick}>
      {` ${word} `}
    </span>
  );
};

export default App;
