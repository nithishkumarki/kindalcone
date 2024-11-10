import React, { useState } from "react";
import styles from "./EditBookDetails.module.css";

const apiurl = process.env.NEXT_PUBLIC_API_URL

export interface Book 
{
    _id: string;
    title: string;
    author: string;
    description: string;
    image: string;
    category: string;
}
interface EditBookDetailsFormProps 
{
    book: Book;
    setEditMode: (editMode: boolean) 
    => void;
}

const EditBookDetailsForm: React.FC<EditBookDetailsFormProps> = ({ book, setEditMode }) => 
    {
    const [formData, setFormData] = useState({
        title:book.title,
         author:book.author,
     description:book.description,
        image:book.image,
        category: book.category,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }

        try {
            const response = await fetch(`${apiurl}/api/books/${book._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Book updated successfully!");
                setEditMode(false);
            } else {
                alert("Failed to update book.");
            }
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Error updating book.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.editBookForm}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            <input type="text" name="author" value={formData.author} onChange={handleChange} required />
            <textarea name="description" value={formData.description} onChange={handleChange} required />
            <input type="text" name="image" value={formData.image} onChange={handleChange} required />
            <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="Book">Book</option>
                <option value="Comic">Comic</option>
                <option value="Sample">Sample</option>
            </select>
            <button type="submit">Save Changes</button>

            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
    );
};

export default EditBookDetailsForm;
