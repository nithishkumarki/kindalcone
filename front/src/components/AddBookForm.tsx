import { useState } from "react";
import styles from './AddBookForm.module.css';

const apiurl = process.env.NEXT_PUBLIC_API_URL
interface FormData {
    title: string;
    author: string;
    description: string;
    price: string;
    amazonLink: string;
    category: string;
    image: string;
    pdf: File;
  }
function AddBookForm() 
{
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    description: "",
    price: "",
    amazonLink: "",
    category: "Book",
    image: "",
    pdf: "" as unknown as File,
  });

  
//   
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target instanceof HTMLInputElement) {
        const files = e.target.files;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : null,
        }));
    } else {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
};

  
 
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FormData];
        if (value) {
          formDataToSend.append(key, value);
        }
    });
    const token = localStorage.getItem('token');
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
  }

    try {
      const response = await fetch(apiurl + "/api/books/create", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token in Authorization header
      },
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Book added successfully!");
      } else {
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Error adding book.");
    }
};

  return (
    <form onSubmit={handleSubmit} className={styles.addBookForm}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="text"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="text"
        name="amazonLink"
        value={formData.amazonLink}
        onChange={handleChange}
        placeholder="Amazon Link"
        required
      />
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="Book">Book</option>
        <option value="Comic">Comic</option>
        <option value="Sample">Sample</option>
      </select>
      <input
        type="text"
        name="image"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="pdf"
        onChange={handleChange}
        required
      />
    
      <button type="submit">Create Book</button>
    </form>
  );
}

export default AddBookForm;