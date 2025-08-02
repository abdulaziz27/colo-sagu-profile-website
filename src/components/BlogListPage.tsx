import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Calendar, User } from "lucide-react";

const BlogListPage = () => {
  console.log("BlogListPage rendered"); // Debug log
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Menggunakan React Query untuk konsistensi dengan landing page
  const {
    data: blogData = [],
    isLoading: blogLoading,
    error,
  } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log("BlogListPage: Making API call to /api/blog-posts");
      const response = await fetch("/api/blog-posts");
      console.log("BlogListPage: API response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
      }
      const data = await response.json();
      console.log("BlogListPage: Received data:", data);
      return data;
    },
  });

  console.log("BlogListPage: Current blogData:", blogData);
  console.log("BlogListPage: Loading status:", blogLoading);

  if (error) {
    console.error("BlogListPage: Query error:", error);
  }

  const filteredBlogs = blogData.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlogClick = (blogId) => {
    console.log("BlogListPage: Clicking blog with ID:", blogId);
    navigate(`/artikel/${blogId}`);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-forest/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-forest hover:text-forest/80 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </button>

          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-forest mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">Blog Colo</h1>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogLoading ? (
            // Loading skeleton - sama seperti di landing page
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((post, index) => (
              <article
                key={post.id || index}
                onClick={() => handleBlogClick(post.id || index)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-forest transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author || "Colo Sagu Team"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                {blogData.length === 0
                  ? "Belum ada artikel"
                  : "Artikel tidak ditemukan"}
              </h3>
              <p className="text-gray-400">
                {blogData.length === 0
                  ? "Admin belum menambahkan artikel"
                  : "Coba kata kunci yang berbeda"}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button (if needed) */}
        {!blogLoading && filteredBlogs.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-forest text-white px-8 py-3 rounded-lg hover:bg-forest/90 transition-colors font-semibold">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
