import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/User';
import { v1 as uuid } from 'uuid';
import s from '../ArticleSite.module.css';

function MainComment({ ky, rsp, usr, txt, setRsp }) {
  const { user } = useContext(UserContext);
  let commentsParent = useRef();
  const reply = useRef();
  const comPar = useRef();
  const respondBox = useRef();
  const textareaRespondParent = useRef();
  const textareaRespond = useRef();
  const textareaRespondParent2 = useRef();
  const textareaRespond2 = useRef();
  const userResponse = useRef();
  let replies = useRef();

  // like dislike
  const like = useRef();
  const dislike = useRef();

  const [openReply, setOpenReply] = useState(false);
  const [openReply2, setOpenReply2] = useState(false);
  const [init, setInit] = useState(false);
  const [curCom, setCurCom] = useState('');

  // get comments on init
  // save comments to arr
  let index = 0;
  useEffect(() => {
    console.log(replies);
    console.log(ky);
    console.log(rsp);
    console.log(commentsParent);
    setCurCom(ky);
    // setRsp.commentsState.forEach((st, idx) => {
    //   console.log(st);
    //   // console.log(st.response[0]);
    //   const id = st.ky;
    //   console.log(id);
    //   let blah = undefined;
    //   if (st.hasOwnProperty('response')) {
    //     blah = st.response[0].ky;
    //     // for (let ind in st.response[0]) {
    //     //   console.log(ind);
    //     //   blah = st.response[0][ind];
    //     //   if (blah) {
    //     //     break;
    //     //   }
    //     // }
    //     // console.log(blah);
    //     if (id === blah) {
    //       index = idx;
    //     }
    //   }
    // });
  }, []);

  useEffect(() => {
    console.log(setRsp.commentsResp);
    // const newArr = [...setRsp.commentsResp];
    // console.log(newArr);
    console.log(setRsp.commentsState);
  }, [setRsp.commentsResp]);

  const handleReply = () => {
    console.log(reply.current.parentElement.parentElement.id);
    setOpenReply((prev) => !prev);
  };

  const handleRT = () => {
    // setOpenReply2((prev) => !prev);
    // const div = document.createElement('div');
    // div.textContent = 'asdasd';
    // userResponse.current.insertBefore(div, replies[2]);
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
  const handleReplyConfirm = (e) => {
    // console.log(setRsp.commentsResp);

    console.log(e.target);
    const { id } = e.target;
    if (id.includes('btnReply')) {
      let text = undefined;
      console.log();
      if (clicked) {
        text = e.target.parentElement.previousSibling.value;
      }
      setRsp.setCommentsResp((prevResp) => {
        return [...prevResp, { ky, user, text }];
      });
      clicked = false;
    }
  };
  const txtArea = (
    <div className={s.textInput} ref={textareaRespondParent}>
      <textarea maxLength="200" ref={textareaRespond}></textarea>
      <div className={s.replyDiv}>
        <i class="fas fa-pencil-alt"></i>
        <button onClick={handleUserConfirm}>Confirm</button>
      </div>
    </div>
  );
  let clicked = false;
  const getC = (e) => {
    const newDiv = document.createElement('div');
    newDiv.style.padding = '1rem';
    newDiv.style.marginBottom = '1rem';
    newDiv.style.backgroundColor = '#293042';
    const txtAr = document.createElement('textarea');
    txtAr.style.resize = 'vertical';
    txtAr.style.border = 'none';
    txtAr.style.color = '#fff';
    txtAr.style.width = '100%';
    txtAr.style.padding = '1rem';
    txtAr.addEventListener('focus', () => {
      txtAr.style.outline = 'none';
    });
    txtAr.style.backgroundColor = '#293042';
    txtAr.id = 'txtReply';
    const newDiv2 = document.createElement('div');
    newDiv2.style.width = '100%';
    newDiv2.style.borderTop = '0.1rem solid #e6e6e6';
    newDiv2.style.display = 'flex';
    newDiv2.style.justifyContent = 'flex-end';
    newDiv2.style.paddingTop = '1rem';
    const i = document.createElement('i');
    i.className = 'fas fa-pencil-alt';
    const btn = document.createElement('button');
    btn.style.backgroundColor = 'transparent';
    btn.style.border = 'none';
    btn.style.color = '#fff';
    btn.style.marginLeft = '.5rem';
    btn.textContent = 'Submit reply';
    btn.id = 'btnReply';

    newDiv2.appendChild(i);
    newDiv2.appendChild(btn);

    newDiv.appendChild(txtAr);
    newDiv.appendChild(newDiv2);
    newDiv.addEventListener('click', handleReplyConfirm(e));

    if (e.target.className.includes('reply') && !clicked) {
      clicked = true;
      for (let i = 0; i < userResponse.current.children.length; i++) {
        if (userResponse.current.children[i].contains(e.target)) {
          userResponse.current.children[i].parentNode.insertBefore(
            newDiv,
            userResponse.current.children[i].nextSibling
          );
        }
      }
    }
  };

  const handleOpinion = (e) => {
    console.log(e.target);
    // const likeRef = setRsp.commentsState.like;
    // const dislikeRef = setRsp.commentsState.dislike;
    // console.log(likeRef);
    // console.log(dislikeRef);
    let eyeDee = undefined;
    let likeArr = [];
    if (
      e.target.id.includes('yes') ||
      e.target.parentElement.children[0].id.includes('yes') ||
      e.target.className.includes('like')
    ) {
      console.log(e.target);
      if (comPar.current.children[0].contains(e.target)) {
        eyeDee = comPar.current.id;
        setRsp.commentsState.forEach((cS, idx) => {
          if (cS.ky === eyeDee) {
            // console.log(setRsp.commentsState[idx]);
            // likeArr = [{ ...setRsp.commentsState[idx] }];
            // likeArr[0].like.push(user);
            // console.log(likeArr);
            // setRsp.setCommentsState(prv => {
            //   return [...prv]
            // })
            likeArr = [...setRsp.commentsState];
            console.log(likeArr);
            if (likeArr[idx].like.length === 0) {
              likeArr[idx].like.push(user);
            } else {
              likeArr[idx].like.forEach((lk) => {
                if (user !== lk) {
                  likeArr[idx].like.push(user);
                }
              });
            }
            console.log(likeArr);
            setRsp.setCommentsState([...likeArr]);
          }
        });
      }
      // e.target.style.display = 'none';
      like.current.children[1].textContent = 1;
      like.current.children[0].style.opacity = '.5';
      dislike.current.children[1].textContent = 0;
      dislike.current.children[0].style.opacity = '1';
    } else if (
      e.target.id.includes('no') ||
      e.target.parentElement.children[0].id.includes('no') ||
      e.target.className.includes('dislike')
    ) {
      like.current.children[1].textContent = 0;
      like.current.children[0].style.opacity = '1';
      dislike.current.children[1].textContent = 1;
      dislike.current.children[0].style.opacity = '.5';
    }
  };

  replies = undefined;
  if (!replies) {
    replies = [];
  }
  commentsParent = undefined;
  if (!commentsParent) {
    commentsParent = [];
  }

  return (
    <>
      <div className={s.commentParent} id={ky} ref={comPar}>
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
            <span className={s.bundleOpinion} onClick={(e) => handleOpinion(e)}>
              <span style={{ color: '#55ad53' }} className={s.like} ref={like}>
                <i id="yes" class="fas fa-heart"></i> <span>0</span>
              </span>
              <span
                style={{ color: '#d33d3d' }}
                className={s.dislike}
                ref={dislike}
              >
                <i id="no" class="fas fa-heart-broken"></i> <span>0</span>
              </span>
            </span>
            <span className={s.reply} onClick={handleReply} ref={reply}>
              <i class="fas fa-reply"></i> Reply
            </span>
          </div>
        </div>
        <div className={s.respondBox} ref={respondBox}>
          {openReply ? txtArea : null}
          <div
            className={s.userResponse}
            ref={userResponse}
            onClick={(e) => {
              getC(e);
            }}
          >
            {/* MAPPING */}
            {setRsp.trigger && rsp
              ? rsp.map((comRsp) => (
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
                        <span class={s.like} style={{ color: '#55ad53' }}>
                          <i class="fas fa-heart"></i> 0
                        </span>
                        <span class={s.dislike} style={{ color: '#d33d3d' }}>
                          <i class="fas fa-heart-broken"></i> 0
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
