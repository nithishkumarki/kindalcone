"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import styles from "./admin.module.css";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Book {
    title: string;
    author: string;
    image: string;
}

const AdminPage = () => {
    const router = useRouter();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserBooks, setSelectedUserBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/all`, {
                    method: "GET",
                });

                if (!response.ok) throw new Error("Failed to fetch users");

                const data: User[] = await response.json();
                setAllUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/user/${userId}`, {
                method: "GET",
            });

            if (!response.ok) throw new Error("Failed to fetch user's books");

            const books: Book[] = await response.json();
            setSelectedUserBooks(books);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div className={styles.main}>
            <h1>Admin Dashboard</h1>
          <Navbar />
            <div className={styles.usersContainer}>
                {allUsers.map((user) => (
                    <div key={user._id} 
                    className={styles.userCard}
                     onClick={() => handleUserClick(user._id)}>
                      
                        <p>Name:{user.name}</p>
                        <p>Email: {user.email}</p>
                    </div>
                ))}
            </div>

            {selectedUserBooks.length > 0 && (
                <div className={styles.booksContainer}>
                    <h2>Books of the User</h2><br/>
                    <div className={styles.booksList}>
                        {selectedUserBooks.map((book) => (
                            <div  key={book._id} className={styles.bookItemList}  onClick={() => router.push(`/book/${book._id}`)} >
                                <img src={book.image} alt={book.title} className={styles.bookImageList} />
                                <div className={styles.bookDetails}>
                                    <h3>{book.title}</h3>
                                    <p>Author: {book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
