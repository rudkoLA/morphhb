import { useEffect, useState } from "react";
import "./App.css";
import { fetchBook } from "./utils/api";
import { TBookName, bookList, bookNamesMap, books } from "./utils/books";
import { generateNumbers } from "./utils/common";

function App() {
  const [data, setData] = useState<string[][] | null>(null);
  const [book, setBook] = useState<TBookName>("Gen");
  const [chapter, setChapter] = useState(1);

  const bookName = bookNamesMap[book].toLowerCase();

  useEffect(() => {
    fetchBook(bookName).then((data: string[][][]) => {
      setData(data[chapter - 1]);
    });
  }, [bookName, chapter]);

  const chapterCount = +books[book].split(" ")[0];
  const bookCount = bookList.length;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBook(e.target.value as TBookName);
    setChapter(1);
  };

  const handleArrowDisable = (next: boolean, isChapter: boolean) => {
    if (next && !isChapter && bookList[bookList.length - 1][0] === book)
      return true;
    if (!next && !isChapter && bookList[0][0] === book) return true;
    if (next && isChapter && chapter === chapterCount) return true;
    if (!next && isChapter && chapter === 1) return true;
    return false;
  };

  const handleArrowClick = (next: boolean, isChapter: boolean) => {
    if (handleArrowDisable(next, isChapter)) return;
    if (next && !isChapter) {
      setBook(
        bookList[
          bookList.map((item) => item[0]).indexOf(book) + 1
        ][0] as TBookName
      );
      setChapter(1);
    }
    if (!next && !isChapter) {
      setBook(
        bookList[
          bookList.map((item) => item[0]).indexOf(book) - 1
        ][0] as TBookName
      );
      setChapter(1);
    }
    if (next && isChapter) setChapter(chapter + 1);
    if (!next && isChapter) setChapter(chapter - 1);
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div className="selector">
          <label>Books</label>
          <select value={book} onChange={handleBookChange}>
            {bookList.map(([key, name]) => (
              <option value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>Chapters</label>
          <select value={chapter} onChange={(e) => setChapter(+e.target.value)}>
            {generateNumbers(chapterCount).map((num) => (
              <option>{num}</option>
            ))}
          </select>
        </div>
      </div>
      <hr />

      <div className="text">
        {data?.map((verse) => (
          <span>
            {verse.map((word) => {
              return <span> {word[0]}</span>;
            })}
          </span>
        ))}
      </div>

      <hr />

      <div className="footer">
        <div className="arrowWrapper">
          <div className="arrow">
            <span
              className={`prev ${handleArrowDisable(false, false) && "hidden"}`}
              onClick={(e) => handleArrowClick(false, false)}
            >
              {"<< Prev Book"}
            </span>
            <span
              className={`next ${handleArrowDisable(true, false) && "hidden"}`}
              onClick={(e) => handleArrowClick(true, false)}
            >
              {"Next Book >>"}
            </span>
          </div>
          <div className="arrow">
            <span
              className={`prev ${handleArrowDisable(false, true) && "hidden"}`}
              onClick={(e) => handleArrowClick(false, true)}
            >
              {"<< Prev Chapter"}
            </span>
            <span
              className={`next ${handleArrowDisable(true, true) && "hidden"}`}
              onClick={(e) => handleArrowClick(true, true)}
            >
              {"Next Chapter >>"}
            </span>
          </div>
        </div>
        <br />

        <div className="selectorWrapper">
          <div className="selector">
            <label>Books</label>
            <select value={book} onChange={handleBookChange}>
              {bookList.map(([key, name]) => (
                <option value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="selector">
            <label>Chapters</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(+e.target.value)}
            >
              {generateNumbers(chapterCount).map((num) => (
                <option>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
