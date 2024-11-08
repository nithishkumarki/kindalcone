
"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import styles from "./KindleLibrary.module.css";
import { FaBookOpen } from "react-icons/fa";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import { MdBook } from "react-icons/md";

import { useRouter } from "next/navigation";

const apiurl = process.env.NEXT_PUBLIC_API_URL

interface Book {
    _id: string;
    image: string;
    title: string;
    author: string;
    category: string;  // Include category in book interface
}

const Page = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<string>('All Titles');   
    const [activeItem, setActiveItem] = useState<string>('All Titles');
    const [viewMode, setViewMode] = useState("grid"); 
    const [filterMenuVisible, setFilterMenuVisible] = useState(false);

    const handleItemClick = (theme: string) => {
        setSelectedTheme(theme);
        setActiveItem(theme); 
    };
    
    const toggleViewMode = () => {
        setViewMode(prevMode => (prevMode == "grid" ? "list" : "grid"));
    };
    const toggleFilterMenu = () => {
        setFilterMenuVisible(!filterMenuVisible); 
      };


    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const response = await fetch(apiurl + "/api/books/all");

                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }
                const data: Book[] = await response.json();
                setAllBooks(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchAllBooks();
    }, []);

    
    const filteredBooks = selectedTheme == 'All Titles' ? allBooks : allBooks.filter(book => book.category == selectedTheme);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.main}>
            <Navbar toggleViewMode={toggleViewMode} viewMode={viewMode} toggleFilterMenu={toggleFilterMenu} />

            
            {filterMenuVisible && 
            (<div className={styles.filterDropdown}>
          <span onClick={() => { handleItemClick('All Titles'); setFilterMenuVisible(false); }} className={activeItem === 'All Titles' ? styles.active : ''}>All Titles</span>
          <span onClick={() => { handleItemClick('Comic'); setFilterMenuVisible(false); }} className={activeItem === 'Comic' ? styles.active : ''}>Comics</span>
          <span onClick={() => { handleItemClick('Sample'); setFilterMenuVisible(false); }} className={activeItem === 'Sample' ? styles.active : ''}>Samples</span>
          </div>)
      }
            <div className={styles.row}>
                <div className={styles.left}>
                    <div className={styles.menuMain}>
                        <FaBookOpen className={styles.bookicon} />
                        <p>Library</p>
                        {show ? (
                            <FaChevronDown
                                onClick={() => setShow(!show)}
                                className={styles.toRight}
                            />
                        ) : (
                            <FaChevronRight
                                onClick={() => setShow(!show)}
                                className={styles.toRight}
                            />
                        )}
                    </div>
                    {show && (
                        <div className={styles.menuItems}>
                            <span onClick={() => handleItemClick('All Titles')}className={activeItem == 'All Titles' ? styles.active : ''}>All Titles</span>
                            <span onClick={() => handleItemClick('Book')}className={activeItem =='Book' ? styles.active : ''}>Books</span>
                            <span onClick={() => handleItemClick('Comic')}className={activeItem == 'Comic' ? styles.active : ''}>Comics</span>
                            <span onClick={() => handleItemClick('Sample')}className={activeItem == 'Sample' ? styles.active : ''}>Samples</span>
                        </div>
                    )}
                    <div className={styles.menuMain}>
                        <MdBook className={styles.bookicon2} />
                        <p>Notes & Highlights</p>
                    </div>
                </div>
                <div className={styles.right}>
                    <h1>{selectedTheme}</h1> 
                    <div className={viewMode === "grid" ? styles.booksGrid : styles.booksList}>
                        {filteredBooks.map((book) => (
                            <div
                                onClick={() => {
                                    router.push(`/book/${book._id}`);
                                }}
                                key={book._id}
                                className={viewMode == "grid" ? styles.bookItemGrid : styles.bookItemList}
                            >
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className={viewMode === "grid" ? styles.bookImageGrid : styles.bookImageList}
                                />
                                <div className={styles.bookDetails}>
                                    <h3 className={styles.bookTitle}>{book.title}</h3>
                                    <p className={styles.bookAuthor}>{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

