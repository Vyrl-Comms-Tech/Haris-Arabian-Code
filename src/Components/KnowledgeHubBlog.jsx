import React from "react";
import "../Styles/knowledge-hub-blog.css";

export default function KnowledgeHubBlog() {
  const blogData = [
    {
      id: 1,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 2,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 3,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 4,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 5,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 6,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 7,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
    {
      id: 8,
      image: "/Assets/blog.jpg",
      category: "Blogs and News",
      title: "Dubai's Next Chapter: Built on British Standards",
    },
  ];

  return (
    <div className="knowledge-hub-blog">
      <h1>Blogs</h1>
      <div className="knowledge-hub-blog-container">
        {blogData.map((item) => (
          <div className="blog-card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="content">
              <div className="category-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <circle cx="5" cy="5" r="5" fill="#011825" />
                </svg>
                <span className="category">{item.category}</span>
              </div>
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
