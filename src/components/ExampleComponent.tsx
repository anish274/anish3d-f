import { useNotionData } from '../hooks/useAboutMeData';
import { Books as fallbackBooks } from '../data/lifeApi';

export function ExampleComponent() {
  const { notionData, loading, error } = useNotionData();
  
  // Use the data from Notion or fall back to the static data
  const books = loading || error ? fallbackBooks : notionData.Books;
  
  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              {book.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}