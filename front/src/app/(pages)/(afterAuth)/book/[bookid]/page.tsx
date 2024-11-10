"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./Book.module.css";
import { useParams, useRouter } from "next/navigation";
import EditBookDetailsForm from "@/components/EditBookDetails";

const apiurl = process.env.NEXT_PUBLIC_API_URL;

interface Book 
{
    _id: string;
    image: string;
    title: string;
    author: string;
    description: string;
    amazonLink: string;
}

const BookPage = () => {
    const { bookid } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    
    const handleEdit = () => setEditMode(true);

    const handleDelete = async () => 
        {
        const token = localStorage.getItem("token");
    
        if (!token) {
            setError("No token found. Please log in.");
            return;
        }
    
        try {
            const response = await fetch(`${apiurl}/api/books/${bookid}`,
                { method:'DELETE',headers:{'Authorization': `Bearer ${token}`}});
    
            if (!response.ok) {
                throw new Error("Failed to delete book");
            }
    
            alert("Book deleted successfully");
            router.push("/kindle-library"); 
        } 
        catch (err) {
            console.error(err);
            setError( err.message);
        }
    };
    

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${apiurl}/api/books/${bookid}`);
                if (!response.ok) throw new Error("Failed to fetch book data");
                const data = await response.json();
                setBook(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "An error occurred");
                setLoading(false);
            }
        };
        fetchBook();
    }, [bookid]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <img src={book.image} alt={book.title} className={styles.bookImage} />
                </div>
                <div className={styles.details}>
                    <h1 className={styles.bookTitle}>{book.title}</h1>
                    <p className={styles.bookAuthor}>by {book.author}</p>
                    <div
                        className={styles.bookDescription}
                        dangerouslySetInnerHTML={{ __html: book.description }}
                    />
                    <button className={styles.purchaseButton} onClick={() => router.push(`/read/${bookid}`)}>
                        Start Reading
                    </button><br/>
                    <button className={styles.purchaseButton} onClick={handleEdit}> 
                        Edit
                    </button><br/>
                    <button className={styles.purchaseButton} onClick={handleDelete}>
                        Delete
                    </button>

                </div>
                {editMode && (
                    <EditBookDetailsForm book={book} setEditMode={setEditMode} />
                )}
            </div>
        </div>
    );
};

export default BookPage;
