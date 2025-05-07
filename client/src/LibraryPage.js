import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LibraryPage.css";

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    axios.get("https://library-management-system-v5vr.onrender.com/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const openPopup = (book, type) => {
    setSelectedBook(book);
    setActionType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setUserInfo({ name: "", email: "" });
    setSelectedBook(null);
    setActionType("");
  };

  const handleSubmit = async () => {
    if (!userInfo.name || !userInfo.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      await axios.post("https://library-management-system-v5vr.onrender.com/api/track-access", {
        name: userInfo.name,
        email: userInfo.email,
        bookTitle: selectedBook.title,
        action: actionType
      });

      if (actionType === "read") {
        window.open(`https://library-management-system-v5vr.onrender.com/${selectedBook.filePath}`, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = `https://library-management-system-v5vr.onrender.com/${selectedBook.filePath}`;
        link.download = selectedBook.title + ".pdf";
        link.click();
      }

      closePopup();
    } catch (err) {
      alert("Submission failed.");
    }
  };

  return (
    <div className="library-container">
      <header className="library-header">
        <h2>My Digital Library</h2>
        <input 
          type="text" 
          placeholder="🔍 Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <br /><br />
      <div className="book-grid">
        {books.filter(book =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(book => (
          <div className="book-card" key={book._id}>
            <img src={`https://library-management-system-v5vr.onrender.com/${book.coverImagePath}`} alt="Cover" />
            <div className="book-details">
              <h4>{book.title}</h4>
              <p><strong>{book.category}</strong></p>
              <p>{book.author}</p>
              <div className="btn-group">
                <button className="read-btn" onClick={() => openPopup(book, "read")}>📖 Read</button>
                <button className="download-btn" onClick={() => openPopup(book, "download")}>📥 Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Enter your details</h3>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={userInfo.name} 
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={userInfo.email} 
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} 
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={closePopup} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
