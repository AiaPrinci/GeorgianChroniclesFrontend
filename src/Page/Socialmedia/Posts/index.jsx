import './style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../../../alert';
import x from '@/assets/svgs/x.svg';
import AutoFontText from '../../../isGeorgian';
import emptyHeart from '@/assets/svgs/emptyHeart.svg';
import filledHeart from '@/assets/svgs/filledHeart.svg';
import comment from '@/assets/svgs/comment.svg';
import send from '@/assets/svgs/send.svg';
import stevepfp from '@/assets/images/Steve.png'

export const Posts = () => {
    const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
    const [canPost, setCanPost] = useState(true);
    const [authStatus, setAuthStatus] = useState({
        username: "",
        role: ""
    });
    const navigate = useNavigate();
    const [commentsInput, setCommentsInput] = useState({});

    const [post, setPost] = useState({
        title: '',
        content: '',
        image: null,
        video: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [posts, setPosts] = useState([]);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);

    const showCustomAlert = (msg, type = "success", duration = 3000) => {
        setAlertMessage(msg);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), duration);
    };

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(
                    'https://georgianchroniclesbackend.onrender.com/auth-status',
                    { withCredentials: true }
                );

                if (!res.data.logged_in) {
                    navigate('/login');
                    return;
                }

                setAuthStatus({username: res.data.user.username, role: res.data.user.role});

            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };

        fetchAuthStatus();
    }, [navigate]);

    const handlePostUpload = async (e) => {
        e.preventDefault();
        if (!canPost) {
            showCustomAlert("დაელოდე 10 წამი პოსტის ხელახლა ასატვირთად", "error", 10000);
            return;
        }

        const formData = new FormData();
        formData.append("title", post.title);
        formData.append("content", post.content);
        if (post.image) formData.append("image", post.image);
        if (post.video) formData.append("video", post.video);

        try {
            const res = await axios.post(
                'https://georgianchroniclesbackend.onrender.com/posts',
                formData,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            setPosts([res.data.post, ...posts]);

            setPost({ title: "", content: "", image: null, video: null });
            setImagePreview(null);
            setVideoPreview(null);

            showCustomAlert("პოსტი წარმატებით აიტვირთა", "success", 3000);
        } catch (error) {
            console.error("Error uploading post:", error);
            showCustomAlert("პოსტი ვერ აიტვირთა", "error", 3000);
        }
        setCanPost(false);
        setTimeout(() => setCanPost(true), 10000);
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`https://georgianchroniclesbackend.onrender.com/posts/${postId}`, { withCredentials: true });
            setPosts(posts.filter(post => post.id !== postId));
            showCustomAlert("პოსტი წარმატებით წაიშალა", "success", 3000);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                const posts = await axios.get(
                    'https://georgianchroniclesbackend.onrender.com/posts',
                    { withCredentials: true }
                );

                setPosts(posts.data);
            } catch (error) {
                console.error("Error uploading post:", error);
            }
        };
        fetchPosts();
    }, []);

    const handleAddComment = async (postId) => {
        try {
            await axios.post(
                `https://georgianchroniclesbackend.onrender.com/posts/${postId}/comments`,
                { content: commentsInput[postId] },
                { withCredentials: true }
            );

            setCommentsInput({ ...commentsInput, [postId]: '' });

            const res = await axios.get(
                'https://georgianchroniclesbackend.onrender.com/posts',
                { withCredentials: true }
            );
            setPosts(res.data);

            } catch (error) {
                console.error("Error adding comment:", error);
            }
    };

    const handleDeleteComment = async (commentId, postId) => {
        try {
            await axios.delete(`https://georgianchroniclesbackend.onrender.com/comments/${commentId}`, { withCredentials: true });

            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(c => c.id !== commentId)
                    };
                }
                return post;
            }));
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
    };


    const handleLike = async (postId) => {
        try {
            const res = await axios.post(
                `https://georgianchroniclesbackend.onrender.com/posts/${postId}/like`,
                {},
                { withCredentials: true }
            );

            setPosts(posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likes: res.data.message === "Post liked" ? post.likes + 1 : post.likes - 1,
                        liked_by_me: res.data.message === "Post liked"
                    }
                    : post
            ));
        } catch (error) {
            console.error("error adding like", error);
        }
    };

    useEffect(() => {
        if (openCommentsPostId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openCommentsPostId]);


    return (
        <div className="Posts">
            <Alert
                message={alertMessage}
                type={alertType}
                visible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <div className='posts_container'>
                <div className='post_upload_container'>
                    <h1 className='post_upload_title'>გააზიარე შენი ფიქრები</h1>
                    <form className='post_upload_form' onSubmit={handlePostUpload}>
                        <input
                            className='post_upload_input'
                            type="text"
                            placeholder="სათაური"
                            value={post.title}
                            onChange={(e) =>
                                setPost({ ...post, title: e.target.value })
                            }
                        />
                        <textarea
                            className='post_upload_input'
                            type="text"
                            placeholder="დაწერე შენი პოსტი"
                            id='post_upload_textarea'
                            value={post.content}
                            onChange={(e) =>
                                setPost({ ...post, content: e.target.value })
                            }
                        ></textarea>
                        {imagePreview && (
                            <div className="image_preview_container">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className='post_upload_media'
                                />
                            </div>
                        )}
                        {videoPreview && (
                            <div className="video_preview_container">
                                <video
                                    src={videoPreview}
                                    controls
                                    className='post_upload_media'
                                />
                            </div>
                        )}
                        <label className='post_image_uploader_btn' htmlFor="post_image_uploader">ატვირთე მედია</label>
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                if (file.type.startsWith("video/")) {
                                    setPost({ ...post, video: file, image: null });
                                    setVideoPreview(URL.createObjectURL(file));
                                    setImagePreview(null);
                                } else {
                                    setPost({ ...post, image: file, video: null });
                                    setImagePreview(URL.createObjectURL(file));
                                    setVideoPreview(null);
                                }
                            }}
                            id='post_image_uploader'
                            accept='image/*,video/*'
                        />
                        <button className='post_upload_btn' type="submit"><p>დაპოსტე</p></button>
                    </form>
                </div>
                <div className='posts'>
                    <h1 className='posts_heading'>სიახლეების ველი</h1>
                    {posts.map(post => (
                        <div className='post'>
                            <div className='post_heading_container'>
                                <div className='post_author'>
                                    <Link to={`/users/${post.author.id}`}>
                                        <img className='post_author_pfp' width='64px' src={(post.author.image && `https://georgianchroniclesbackend.onrender.com/static/uploads/${post.author.image}`) || `${stevepfp}`} alt="" />
                                    </Link>
                                    <div>
                                        <Link to={`/users/${post.author.id}`}><p className='post_author_name'>{post.author.username}</p></Link>
                                        <p className='post_date'>{post.created_at}</p>
                                    </div>
                                </div>
                                {(authStatus.username === post.author.username || authStatus.role === "admin") && (
                                    <img src={x} className='post_delete' onClick={() => handleDelete(post.id)} />
                                )}
                            </div>
                            <div className='post_content_container'>
                                <AutoFontText classN='post_title' text={post.title} />
                                <AutoFontText classN='post_text' text={post.content} />
                            </div>
                            {post.media_type === "image" && (
                                <img
                                    src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${post.media}`}
                                    alt="post"
                                    className='post_media'
                                />
                            )}
                            {post.media_type === "video" && (
                                <video
                                    src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${post.media}`}
                                    controls
                                    className='post_media'
                                />
                            )}

                            <div className='post_footer_container'>
                                <div className='post_like_btn'>
                                    <img className='post_like_heart' onClick={() => handleLike(post.id)} src={post.liked_by_me ? filledHeart : emptyHeart} alt="" />
                                    <p>{post.likes}</p>
                                </div>
                                <div className='post_comments_btn'>
                                    <img className='post_comment_img' src={comment} alt="comment_img" onClick={() => setOpenCommentsPostId(openCommentsPostId === post.id ? null : post.id)}  />
                                    <p>{post.comments.length}</p>
                                </div>
                            </div>

                            {openCommentsPostId === post.id && (
                                <div className='comments_container'>
                                    <div className="comments">
                                        <div className='comments_header_container'>
                                            <h1 className='comments_title'>კომენტარები</h1>
                                            <img onClick={() => setOpenCommentsPostId(null)} className='comments_close_btn'  src={x} alt="close_btn" />
                                        </div>
                                        <div className='comments_inner_container'>
                                            {post.comments.map(comment => (
                                                <div className='comment'>
                                                    <div className='comment_pfp_container'>
                                                        <img className='comment_pfp'  src={(comment.user_pfp && `https://georgianchroniclesbackend.onrender.com/static/uploads/${comment.user_pfp}`) || `${stevepfp}`} alt="" />
                                                    </div>
                                                    <div className='comment_text_container'>
                                                        <div className='comment_text_inner'>
                                                            <Link to={`/users/${comment.user_id}`}><p className='comment_user'>{comment.user}</p></Link>
                                                            <AutoFontText classN='comment_content' text={comment.content} />
                                                        </div>
                                                        {(authStatus.username === comment.user || authStatus.role === "admin") && (
                                                            <img src={x} className='comment_delete_btn' onClick={() => handleDeleteComment(comment.id, post.id)} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='comments_input_container'>
                                            <input
                                                type="text"
                                                placeholder="რას ფიქრობ ამ პოსტზე?"
                                                value={commentsInput[post.id] || ''}
                                                onChange={(e) =>
                                                    setCommentsInput({
                                                        ...commentsInput,
                                                        [post.id]: e.target.value
                                                    })
                                                }
                                                className='comments_input'
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddComment(post.id);
                                                    }
                                                }}
                                            />
                                            <img className='comments_send_btn' onClick={() => handleAddComment(post.id)} src={send} alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}