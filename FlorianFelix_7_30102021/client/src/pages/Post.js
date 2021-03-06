import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { Image } from "cloudinary-react";
import CancelIcon from "@material-ui/icons/Cancel";
import dateFormat from "dateformat";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  dateFormat("2019-04-30T08:59:00.000Z", "dddd, mmmm dS, yyyy");

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    if (newComment.length != 0) {
      axios
        .post(
          "http://localhost:3001/comments",
          {
            commentBody: newComment,
            PostId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            const commentToAdd = {
              commentBody: newComment,
              username: response.data.username,
            };
            setComments([...comments, commentToAdd]);
            setNewComment("");
          }
        });
    } else {
      alert("le commentaire ne doit pas être vide");
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title">{postObject.title}</div>
          <div className="body">
            <Image
              className="PostImage"
              cloudName="dfhqbiyir"
              publicId={postObject.image}
            />
            <div className="text">{postObject.postText}</div>
          </div>
          <div className="footer">
            <div className="left_side_footer">
              <div className="username_footer">{postObject.username}</div>
              <div className="date"> {dateFormat(postObject.createdAt)} </div>
            </div>
            {authState.username === postObject.username &&
              authState.isAdmin !== true && (
                <button
                  className="delete"
                  onClick={() => {
                    let confirm = window.confirm(
                      "Voulez vous supprimez le post ?"
                    );
                    if (confirm) deletePost(postObject.id);
                  }}
                >
                  Delete Post
                </button>
              )}

            {authState.isAdmin === true && (
              <button
                className="delete"
                onClick={() => {
                  let confirm = window.confirm(
                    "Voulez vous supprimez le post ?"
                  );
                  if (confirm) deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="100 caractères maximum..."
            autoComplete="off"
            minLength="5"
            maxLength="100"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <label>
                  <h3>
                    <div className="date">{dateFormat(comment.createdAt)}</div>
                    {comment.username} :
                  </h3>

                  {comment.commentBody}
                </label>

                {authState.username === comment.username &&
                  authState.isAdmin !== true && (
                    <CancelIcon
                      className="button"
                      onClick={() => {
                        deleteComment(comment.id);
                      }}
                    ></CancelIcon>
                  )}
                {authState.isAdmin === true && (
                  <CancelIcon
                    className="button"
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  ></CancelIcon>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
