import React, { useState } from "react";
import "./admin.css";
import axios from "axios";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    const imageFile = e.target.files[0];
    setCoverImage(imageFile);
    setCoverPreview(URL.createObjectURL(imageFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("file", file);
    formData.append("coverImage", coverImage); // ✅ sending cover image

    try {
      await axios.post("https://library-management-system-mj2e.onrender.com/api/books", formData);
      alert("Book uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-cover">
        <h1>📚 Admin Book Upload Panel</h1>
        <p>Upload books with cover images to the library.</p>
      </div>

      <div className="admin-content">
        <div className="book-details-box">
          <h4>Book Details</h4>
          <p>Please fill in the book information below.</p>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" required />
          <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" required />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input" required />

          <label className="file-label">Upload Book PDF</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="admin-input" required />

          <label className="file-label">Upload Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="admin-input" />

          {coverPreview && (
            <div className="cover-preview">
              <p>Cover Preview:</p>
              <img src={coverPreview} alt="Cover Preview" />
            </div>
          )}

          <button type="submit" className="upload-button">Upload Book</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
