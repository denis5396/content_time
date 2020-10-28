import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/User';
import { v1 as uuid } from 'uuid';
import s from '../ArticleSite.module.css';

function MainComment({ ky, usr, txt, setRsp }) {
  const { user } = useContext(UserContext);
  const commentsParent = useRef();
  const reply = useRef();
  const respondBox = useRef();
  const textareaRespondParent = useRef();
  const textareaRespond = useRef();
  const textareaRespondParent2 = useRef();
  const textareaRespond2 = useRef();
  const userResponse = useRef();
  let replies = useRef();

  const [openReply, setOpenReply] = useState(false);
  const [openReply2, setOpenReply2] = useState(false);
  const [cnt, setCnt] = useState(0);
  const [init, setInit] = useState(false);
  // get comments on init
  // save comments to arr
  useEffect(() => {
    console.log(replies);
    console.log(ky);
  }, []);

  useEffect(() => {
    const newArr = [...setRsp.commentsResp];
    console.log(newArr);
    console.log(setRsp.commentsState);
  }, [setRsp.commentsResp]);

  const handleReply = () => {
    setOpenReply((prev) => !prev);
  };

  const handleRT = () => {
    setOpenReply2((prev) => !prev);
    const div = document.createElement('div');
    div.textContent = 'asdasd';
    userResponse.current.insertBefore(div, replies[2]);
  };

  const handleUserConfirm = () => {
    let text = undefined;
    if (openReply) {
      text = textareaRespond.current.value;
    } else if (openReply2) {
      text = textareaRespond2.current.value;
    }
    console.log(setRsp.commentsResp);
    setRsp.setCommentsResp((prevResp) => {
      return [...prevResp, { ky, user, text }];
    });
  };
  const txtArea = (
    <div className={s.textInput} ref={textareaRespondParent}>
      <textarea maxLength="200" ref={textareaRespond}></textarea>
      <div className={s.replyDiv}>
        <i class="fas fa-pencil-alt"></i>{' '}
        <button onClick={handleUserConfirm}>Confirm</button>
      </div>
    </div>
  );

  replies = undefined;
  if (!replies) {
    replies = [];
  }

  return (
    <>
      <div className={s.commentParent} ref={commentsParent}>
        <div className={s.comments}>
          <div className={s.user}>
            <div className={s.userIcon}>
              <i class="fas fa-user-circle"></i>
            </div>
            <div className={s.userTitle}>{usr}</div>
          </div>
          <div className={s.userComment}>
            <p>{txt}</p>
          </div>
          <div className={s.commentOpinion}>
            <span className={s.bundleOpinion}>
              <span class={s.like}>
                <i class="fas fa-heart"></i> 21
              </span>
              <span class={s.dislike}>
                <i class="fas fa-heart-broken"></i> 5
              </span>
            </span>
            <span className={s.reply} onClick={handleReply} ref={reply}>
              <i class="fas fa-reply"></i> Reply
            </span>
          </div>
        </div>
        <div className={s.respondBox} ref={respondBox}>
          {openReply ? txtArea : null}
          <div className={s.userResponse} ref={userResponse}>
            {/* MAPPING */}
            {setRsp.trigger
              ? setRsp.commentsState[0].response.map((comRsp) => (
                  <div
                    className={s.comments}
                    key={uuid()}
                    ref={(rsp) => {
                      replies.push(rsp);
                    }}
                  >
                    <div className={s.user}>
                      <div className={s.userIcon}>
                        <i class="fas fa-user-circle"></i>
                      </div>
                      <div className={s.userTitle}>{comRsp.user}</div>
                    </div>
                    <div className={s.userComment}>
                      <p>{comRsp.text}</p>
                    </div>
                    <div className={s.commentOpinion}>
                      <span className={s.bundleOpinion}>
                        <span class={s.like}>
                          <i class="fas fa-heart"></i> 21
                        </span>
                        <span class={s.dislike}>
                          <i class="fas fa-heart-broken"></i> 5
                        </span>
                      </span>
                      <span className={s.reply} onClick={handleRT} ref={reply}>
                        <i class="fas fa-reply"></i> Reply
                      </span>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainComment;
