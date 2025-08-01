import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2, BookOpen } from "lucide-react";

const BlogDetailPage = () => {
  console.log("BlogDetailPage rendered"); // Debug log
  const { id } = useParams(); // Mendapatkan ID dari URL
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      console.log("BlogDetailPage: Starting fetch for ID:", id);

      try {
        // Coba dulu ambil semua blog posts, lalu filter by ID
        console.log("BlogDetailPage: Trying to fetch all blog posts first...");
        const allResponse = await fetch("/api/blog-posts");
        console.log(
          "BlogDetailPage: All posts response status:",
          allResponse.status
        );

        if (allResponse.ok) {
          const allData = await allResponse.json();
          console.log("BlogDetailPage: All blog posts:", allData);
          console.log(
            "BlogDetailPage: Looking for ID:",
            id,
            "Type:",
            typeof id
          );

          // Cari blog berdasarkan ID
          const foundBlog = allData.find((blog) => {
            console.log(
              "Comparing:",
              blog.id,
              "with",
              id,
              "Types:",
              typeof blog.id,
              typeof id
            );
            return blog.id == id || blog.id === parseInt(id);
          });

          console.log("BlogDetailPage: Found blog:", foundBlog);

          if (foundBlog) {
            setBlogData(foundBlog);

            // Set related blogs (exclude current)
            const related = allData.filter((blog) => blog.id != id).slice(0, 2);
            setRelatedBlogs(related);
          } else {
            console.log("BlogDetailPage: No blog found with ID:", id);
            setBlogData(null);
          }
        } else {
          console.error(
            "BlogDetailPage: Failed to fetch all posts, status:",
            allResponse.status
          );

          // Fallback: coba endpoint specific
          console.log(
            "BlogDetailPage: Trying specific endpoint /api/blog-posts/" + id
          );
          const specificResponse = await fetch(`/api/blog-posts/${id}`);
          console.log(
            "BlogDetailPage: Specific endpoint status:",
            specificResponse.status
          );

          if (specificResponse.ok) {
            const specificData = await specificResponse.json();
            console.log(
              "BlogDetailPage: Specific endpoint data:",
              specificData
            );
            setBlogData(specificData);
          } else {
            setBlogData(null);
          }
        }
      } catch (error) {
        console.error("BlogDetailPage: Error fetching blog data:", error);
        setBlogData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    } else {
      console.log("BlogDetailPage: No ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/blog");
  };

  const handleRelatedClick = (blogId) => {
    navigate(`/artikel/${blogId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogData?.title,
        text: blogData?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback untuk browser yang tidak support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link artikel telah disalin!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-forest/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-forest/10 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">
            Artikel tidak ditemukan
          </h2>
          <p className="text-gray-400 mb-4">
            Artikel yang Anda cari tidak tersedia
          </p>
          <button
            onClick={handleBackClick}
            className="bg-forest text-white px-6 py-2 rounded-lg hover:bg-forest/90 transition-colors"
          >
            Kembali ke Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-forest/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center text-forest hover:text-forest/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Blog
          </button>

          {/* Article Header */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {blogData?.title || "Judul tidak tersedia"}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>
                    {blogData?.author || blogData?.penulis || "Colo Sagu Team"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {blogData?.created_at
                      ? new Date(blogData.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Tanggal tidak tersedia"}
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center text-forest hover:text-forest/80 transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* Excerpt */}
              {blogData?.excerpt && (
                <div className="bg-sage/10 p-4 rounded-lg mb-8">
                  <p className="text-lg text-gray-700 italic">
                    {blogData.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Isi Artikel:
                </h3>
                {blogData?.content ? (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: blogData.content }}
                    style={{
                      lineHeight: "1.8",
                      color: "#374151",
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    Konten artikel tidak tersedia
                  </p>
                )}
              </div>

              {/* Debug Info - Hapus ini setelah selesai debug */}
              {/* <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">
                  Debug Info (hapus nanti):
                </h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(blogData, null, 2)}
                </pre>
              </div> */}
            </div>
          </article>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Artikel Terkait
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    onClick={() => handleRelatedClick(blog.id)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-forest transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
