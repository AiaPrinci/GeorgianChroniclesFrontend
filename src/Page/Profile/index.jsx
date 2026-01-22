import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import './style.css';
import Alert from "../../alert";
import filledHeart from '@/assets/svgs/filledheart.svg';
import emptyHeart from '@/assets/svgs/emptyheart.svg';
import stevepfp from '@/assets/images/Steve.png';
import x from '@/assets/svgs/x.svg';
import comment from '@/assets/svgs/comment.svg';
import AutoFontText from "../../isGeorgian";
import send from '@/assets/svgs/send.svg';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [commentsInput, setCommentsInput] = useState({});
  const [authStatus, setAuthStatus] = useState({ username: "", role: "" });
  const [openProfileEdit, setOpenProfileEdit] = useState(null);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);

  const showCustomAlert = (msg, type = "success", duration = 3000) => {
    setAlertMessage(msg);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), duration);
  };

  const isSelf = user.id === parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://georgianchroniclesbackend.onrender.com/users/${userId}`, { withCredentials: true });
        setUser(res.data);
        setEditUsername(res.data.username);
        setEditBio(res.data.bio);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get("https://georgianchroniclesbackend.onrender.com/auth-status", { withCredentials: true });
        if (res.data.logged_in) setAuthStatus(res.data.user);
      } catch (err) {
        console.error("Error fetching auth status:", err);
      }
    };

    fetchProfile();
    fetchAuthStatus();
  }, [userId]);

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("username", editUsername);
    formData.append("bio", editBio);
    if (profileImage) formData.append("profile_image", profileImage);

    axios.put(`https://georgianchroniclesbackend.onrender.com/users/${userId}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(() => window.location.reload())
    .catch(err => {
      if (err.response && err.response.data && err.response.data.error) {
        showCustomAlert(`${err.response.data.error}`, "error", 3000);
      } else {
        console.error("Unexpected error:", err);
      }
    });
  };

  const handleAddComment = async (postId) => {
    try {
      await axios.post(
        `https://georgianchroniclesbackend.onrender.com/posts/${postId}/comments`,
        { content: commentsInput[postId] },
        { withCredentials: true }
      );

      setCommentsInput({ ...commentsInput, [postId]: '' });

      const res = await axios.get(`https://georgianchroniclesbackend.onrender.com/users/${userId}`, { withCredentials: true });
      setPosts(res.data.posts || []);
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

        const liked = res.data.message === "Post liked";

        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        liked_by_me: liked,
                        likes: liked
                            ? post.likes + 1
                            : Math.max(0, post.likes - 1)
                    }
                    : post
            )
        );
    } catch (error) {
        console.error("error adding like", error);
    }
};

  useEffect(() => {
    if (openProfileEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openProfileEdit]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`https://georgianchroniclesbackend.onrender.com/posts/${postId}`, { withCredentials: true });
        setPosts(posts.filter(post => post.id !== postId));
        showCustomAlert("პოსტი წარმატებით წაიშალა", "success", 3000);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  return (
    <div className="profile">
      <Alert
        message={alertMessage}
        type={alertType}
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      {openProfileEdit && (
        <div className="edit_profile_container">
          <div className="edit_profile_inner">
            <div className="edit_profile_tab">
              <p className="edit_profile_title">პროფილის რედაქტირება</p>
              <img className="edit_profile_close_btn" onClick={() => setOpenProfileEdit(prev => !prev)} src={x} alt="" />
            </div>
            <div className="edit_profile_input_container">
              <img className="pfp_preview" src={pfpPreview || (user.profile_image ? `https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}` : stevepfp)} />
              <label className="pfp_update_btn" htmlFor="pfpChange">განაახლე ფოტო</label>
              <input
                type="file"
                onChange={e => {
                  const file = e.target.files[0];
                  setProfileImage(file);
                  setPfpPreview(URL.createObjectURL(file));}
                }
                id="pfpChange"
              />
              <div className="edit_input_inner_container">
                <label className="edit_input_label username" htmlFor="username">სახელი</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="edit_profile_input"
                  id="username"
                />
              </div>
              <div className="edit_input_inner_container">
                <label className="edit_input_label bio" htmlFor="bio">ბიო</label>
                <textarea
                  type="text"
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="edit_profile_input"
                  id="bio"
                ></textarea>
              </div>
            </div>
            <div className="edit_profile_btn_container">
              <button className="profile_update_btn" onClick={handleUpdate}>განახლება</button>            
            </div>
          </div>
        </div>
      )}
      <div className="profile_inner">
        <div className="profile_container">
          <div className="profile_name_container">
            <img
              className="profile_pfp"
              src={(user.profile_image && `https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`) || `${stevepfp}`}
              alt=""
            />
            <div className="profile_text_container">
              <p className="profile_name">{user.username}</p>
              <p className="profile_bio">{user.bio}</p>
            </div>
          </div>

          {isSelf && (
            <div className="edit_profile_btn" onClick={() => setOpenProfileEdit(prev => !prev)}>
              Edit Profile
            </div>
          )}
        </div>

        <div className="profile_posts_container">
          <p className="profile_posts_title">{user.username}-ის პოსტები</p>
          {[...posts].reverse().map(p => (
            <div key={p.id} className="post">
              <div className="post_heading_container">
                <div className="post_author">
                  <img className='post_author_pfp' width='64px' src={(user.profile_image && `https://georgianchroniclesbackend.onrender.com/static/uploads/${user.profile_image}`) || `${stevepfp}`} alt="" />
                  <div>
                    <p className='post_author_name'>{user.username}</p>
                    <p className='post_date'>{p.created_at}</p>
                  </div>
                </div>
                {(authStatus.username === p.author.username || authStatus.role === "admin") && (
                  <img src={x} className='post_delete' onClick={() => handleDelete(p.id)} />
                )}
              </div>
              <div className='post_content_container'>
                <AutoFontText classN='post_title' text={p.title} />
                <AutoFontText classN='post_text' text={p.content} />
              </div>
              {p.media && p.media_type === "image" && (
                <img 
                  src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${p.media}`} 
                  alt="post" 
                  className='post_media'
                />
              )}
              {p.media && p.media_type === "video" && (
                <video controls className='post_media'>
                  <source 
                    src={`https://georgianchroniclesbackend.onrender.com/static/uploads/${p.media}`} 
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}

              <div className="post_footer_container">
                <div className='post_like_btn'>
                  <img className='post_like_heart' onClick={() => handleLike(p.id)} src={p.liked_by_me ? filledHeart : emptyHeart} alt="" />
                  <p>{p.likes}</p>
                </div>
                <div className="post_comments_btn">
                  <img className='post_comment_img' src={comment} alt="comment_img" onClick={() => setOpenCommentsPostId(openCommentsPostId === p.id ? null : p.id)}  />
                  <p>{p.comments.length}</p>
                </div>
              </div>

              {openCommentsPostId === p.id && (
                <div className="comments_container">
                  <div className="comments">
                    <div className='comments_header_container'>
                      <h1 className='comments_title'>კომენტარები</h1>
                      <img onClick={() => setOpenCommentsPostId(null)} className='comments_close_btn'  src={x} alt="close_btn" />
                    </div>
                    <div className="comments_inner_container">
                      {p.comments?.map(comment => (
                        <div className="comment" key={comment.id}>
                          <div className='comment_pfp_container'>
                            <img className='comment_pfp'src={(comment.user_pfp && `https://georgianchroniclesbackend.onrender.com/static/uploads/${comment.user_pfp}`) || `${stevepfp}`}  alt="" />
                          </div>
                          <div className="comment_text_container">
                            <div className="comment_text_inner">
                              <Link to={`/users/${comment.user_id}`}><p className='comment_user'>{comment.user}</p></Link>
                              <AutoFontText classN='comment_content' text={comment.content} />
                            </div>
                            {(authStatus.username === comment.user || authStatus.role === "admin") && (
                              <img src={x} className='comment_delete_btn' onClick={() => handleDeleteComment(comment.id, p.id)} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='comments_input_container'>
                      <input
                        type="text"
                        placeholder="რას ფიქრობ ამ პოსტზე?"
                        value={commentsInput[p.id] || ''}
                        onChange={(e) =>
                          setCommentsInput({
                            ...commentsInput,
                            [p.id]: e.target.value
                          })
                        }
                        className='comments_input'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(p.id);
                          }
                        }}
                      />
                      <img className='comments_send_btn' onClick={() => handleAddComment(p.id)} src={send} alt="send" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;