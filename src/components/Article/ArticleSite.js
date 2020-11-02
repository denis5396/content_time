import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/User';
import { db } from '../../firebase';
import { v1 as uuid } from 'uuid';
import s from './ArticleSite.module.css';
import MainComment from './comments/MainComment';

const ArticleSite = () => {
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  const progressBar = useRef();
  const scrollHeightOne = useRef();
  const scrollOffset = useRef();
  const mainImg = useRef();
  const expand = useRef();
  const overlay = useRef();
  const overlayImg = useRef();
  const comments = useRef();
  const commentEnter = useRef();

  let thumbImgs = useRef();

  const [commentsState, setCommentsState] = useState([]);
  const [commentsResp, setCommentsResp] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [arrived, setArrived] = useState(false);

  const [arr, setArr] = useState([]);
  const [ky, setKy] = useState([]);

  const [clickedLike, setClickedLike] = useState(false);

  // init comments on load

  let url = undefined;
  let queryParam = '';
  let imageUrls = [];
  // useEffect(() => {
  //   if (arr && thumbImgs[0]) {
  //     thumbImgs[0].style.border = '0.3rem solid lightseagreen';
  //     console.log(thumbImgs);
  //   }
  //   alert('ha');
  // });
  useEffect(() => {
    if (localStorage.getItem('userName')) {
      const usr = JSON.parse(localStorage.getItem('userName'));
      setUser(usr);
    }
    handleScroll();
    console.log(thumbImgs);
    url = window.location.href;
    queryParam = '';
    let bool = false;
    for (let i = 0; i < url.length; i++) {
      if (url[i] === '-') {
        bool = true;
        queryParam += url[i];
      } else if (bool) {
        queryParam += url[i];
      }
    }
    var ref = db.ref('content/' + '' + queryParam + '');
    console.log(ref);
    ref.once('value').then(function (snapshot) {
      var key = snapshot.key; // "ada"
      console.log(key);
      const arr = snapshot.child(`imageUrl`).val();
      const arrCom = snapshot.child(`comments`).val();

      if (arrCom) {
        console.log(...arrCom);
        setCommentsState([...arrCom]);
        let respArr = [];
        arrCom.forEach((arrcm) => {
          if (arrcm.hasOwnProperty('response')) {
            respArr.push(...arrcm.response);
          }
        });
        console.log(...respArr);
        setCommentsResp([...respArr]);
        setTrigger(true);
      }
      console.log(arr);
      arr.forEach((img, idx) => {
        console.log(img);
        imageUrls[idx] = img;
        console.log(imageUrls);
      });
      if (arr.length === imageUrls.length) {
        setArr([...imageUrls]);
        mainImg.current.src = imageUrls[0];
        setArr([...imageUrls]);
      }
    });
    console.log(queryParam);
    console.log(url);
    //  scrollOffset.current.style.scrollBehavior = 'smooth'
  }, []);

  useEffect(() => {
    if (commentsState.length > 0) {
      console.log(commentsState);
      url = window.location.href;
      queryParam = '';
      let bool = false;
      for (let i = 0; i < url.length; i++) {
        if (url[i] === '-') {
          bool = true;
          queryParam += url[i];
        } else if (bool) {
          queryParam += url[i];
        }
      }
      if (queryParam) {
        var ref = db.ref('content/' + '' + queryParam + '');
        console.log(ref);
        ref
          .update({
            comments: commentsState,
          })
          .then((res) => {
            var ref = db.ref('content/' + '' + queryParam + '');
            console.log(ref);
            ref.once('value').then(function (snapshot) {
              var key = snapshot.key; // "ada"
              console.log(key);
              const arr = snapshot.child(`comments`).val();
              console.log(arr);
              // setCommentsState([...arr]);
            });
          }); //arrived on backend
      }
    }
  }, [commentsState]);

  useEffect(() => {
    if (commentsResp.length > 0) {
      console.log(commentsResp);
      let newArr = [];
      let respArr = [];
      let respArr2 = [];

      commentsState.forEach((cs, idx) => {
        newArr[idx] = {};
        newArr[idx].response = [];
        newArr[idx].ky = cs.ky;
        newArr[idx].user = cs.user;
        newArr[idx].text = cs.text;
        if (cs.like) {
          newArr[idx].like = [...cs.like];
        } else {
          newArr[idx].like = [];
        }
        if (cs.dislike) {
          newArr[idx].dislike = [...cs.dislike];
        } else {
          newArr[idx].dislike = [];
        }
        let cnt = 0;
        commentsResp.forEach((cR, idxx) => {
          if (cR.ky === cs.ky) {
            console.log(respArr);
            newArr[idx].response[cnt] = {};
            newArr[idx].response[cnt].ky = cR.ky;
            newArr[idx].response[cnt].user = cR.user;
            newArr[idx].response[cnt].text = cR.text;
            if (cR.like) {
              newArr[idx].response[cnt].like = [...cR.like];
            } else {
              newArr[idx].response[cnt].like = [];
            }
            if (cR.dislike) {
              newArr[idx].response[cnt].dislike = [...cR.dislike];
            } else {
              newArr[idx].response[cnt].dislike = [];
            }
            cnt += 1;
          }
        });
        // newArr[idx].response = [...respArr];
      });
      setCommentsState(newArr);
      setTrigger(true);
    }
  }, [commentsResp]);
  const saveComment = () => {
    const text = commentEnter.current.value;
    const id = uuid();
    setKy((prev) => {
      return [...prev, id];
    });
    setCommentsState((prevCom) => {
      return [...prevCom, { ky: id, user, text, response: [] }];
    });
  };

  useEffect(() => {
    if (arr && thumbImgs[0]) {
      thumbImgs[0].style.border = '0.3rem solid lightseagreen';
      console.log(thumbImgs);
    }
  }, [arr]);

  const handleScroll = () => {
    let totalHeight = scrollHeightOne.current.scrollHeight;
    let offSet = Math.abs(
      scrollHeightOne.current.getBoundingClientRect().top -
        scrollHeightOne.current.offsetParent.getBoundingClientRect().top
    );
    if (offSet > 65) {
      let progressHeight = (offSet / (totalHeight - 750)) * 100;
      // console.log(Math.abs(scrollHeightOne.current.getBoundingClientRect().top - scrollHeightOne.current.offsetParent.getBoundingClientRect().top))
      progressBar.current.style.height = progressHeight + '%';
    }
  };
  let count = 0;
  const handleSlider = (e) => {
    const { id } = e.target;
    console.log(thumbImgs[count].style.border);
    if (id.includes('aL')) {
      if (count === 0) {
        count = thumbImgs.length - 1;
      } else {
        count--;
      }
      if (count === thumbImgs.length - 1) {
        thumbImgs[0].style.border = 'none';
      } else {
        thumbImgs[count + 1].style.border = 'none';
      }
      thumbImgs[count].style.border = '0.3rem solid lightseagreen';
      mainImg.current.src = thumbImgs[count].src;
    } else if (id.includes('aR')) {
      count++;
      if (count === thumbImgs.length) {
        count = 0;
      }
      if (count === 0) {
        thumbImgs[thumbImgs.length - 1].style.border = 'none';
      } else {
        thumbImgs[count - 1].style.border = 'none';
      }
      thumbImgs[count].style.border = '0.3rem solid lightseagreen';
      mainImg.current.src = thumbImgs[count].src;
    }
  };

  const showExpand = () => {
    expand.current.style.display = 'block';
  };
  const hideExpand = () => {
    expand.current.style.display = 'none';
  };

  const handleThumbnail = (e) => {
    if (e.target.src) {
      console.log(e.target.src);
      thumbImgs.forEach((thumbImg) => {
        thumbImg.style.border = 'none';
      });
      thumbImgs.forEach((thumbImg, idx) => {
        if (thumbImg.src === e.target.src) {
          console.log(idx);
          count = idx;
          mainImg.current.src = e.target.src;
          e.target.style.border = '0.3rem solid lightseagreen';
        }
      });
    }
  };

  const handleExpand = () => {
    overlay.current.style.display = 'block';
    overlayImg.current.src = mainImg.current.src;
  };

  const removeOverlay = (e) => {
    const { id } = e.target;
    if (id.includes('overlay') && e.target.nodeName !== 'IMG') {
      overlay.current.style.display = 'none';
    }
    if (id.includes('oR')) {
      count++;
      if (count === thumbImgs.length) {
        count = 0;
      }
      overlayImg.current.src = thumbImgs[count].src;
    } else if (id.includes('oL')) {
      if (count === 0) {
        count = thumbImgs.length - 1;
      } else {
        count--;
      }
      overlayImg.current.src = thumbImgs[count].src;
    }
  };

  thumbImgs = undefined;
  if (!thumbImgs) {
    thumbImgs = [];
  }

  return (
    <>
      <div id={s.overlay} ref={overlay} onClick={(e) => removeOverlay(e)}>
        <img id={s.overlayImg} ref={overlayImg} />
        <i id={s.oR} class="fas fa-chevron-right"></i>
        <i id={s.oL} class="fas fa-chevron-left"></i>
      </div>
      <div id={s.articleId}>
        <div id={s.articleDesign}>
          <div id={s.designHeader}>
            <span
              onClick={() =>
                document
                  .querySelector('body')
                  .classList.remove('visible-scrollbar')
              }
            >
              <i class="fas fa-arrow-left"></i> Back to projects
            </span>
            <span id={s.options}>
              <span id={s.dot} />
            </span>
            <div id={s.designTitle}>
              <h1>Nintento of America</h1>
              <h5>nintendo of america</h5>
            </div>
            <span id={s.o}>
              <span id={s.oHide} />
              <ul>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
                <li class={s.oLine}></li>
              </ul>
            </span>
          </div>
        </div>
        <div id={s.articleText} onScroll={handleScroll} ref={scrollOffset}>
          <ul id={s.articleOpts}>
            <li>About</li>
            <li
              onClick={() => {
                mainImg.current.scrollIntoView();
              }}
            >
              Images
            </li>
            <li
              onClick={() => {
                comments.current.scrollIntoView();
              }}
            >
              Comments
            </li>
          </ul>
          <div id={s.articleSliderParent}>
            <div id={s.one} ref={scrollHeightOne}>
              <div id={s.scroll}>
                <div id={s.progressBar} ref={progressBar}></div>
                <div id={s.scrollPath}></div>
              </div>
              {/* <div id={s.body}>
            <span id={s.line}/>
            <h2>About this project</h2>
            <img src={require('../../assets/img/ecommerce.jpg')} style={{marginTop: '2rem'}}/>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            <p className={s.ptext}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti adipisci ratione voluptate temporibus quos consequuntur, amet provident excepturi omnis animi architecto, necessitatibus dolorem minus a placeat. Numquam consequatur quod, vero magnam aspernatur voluptates ipsum animi nemo nulla! Animi ut delectus commodi dolor obcaecati officiis. Repellendus dignissimos commodi sint et rem incidunt totam voluptate quod culpa iure minus nesciunt est tempore, nostrum debitis, odio architecto repudiandae fugiat provident consectetur. Animi inventore tenetur repellendus ad magni ex voluptatibus a mollitia, explicabo asperiores qui illo aspernatur quod aliquid maxime culpa cumque aperiam quasi quisquam. Fugit facere dolorum corporis quis vel ipsum deserunt error?</p>
            </div> */}
              <div id={s.articleImages}>
                <div id={s.articleImagesMain} onClick={handleSlider}>
                  <i id={s.aL} class="fas fa-chevron-left"></i>
                  <img
                    src={imageUrls[0] ? imageUrls[0] : ''}
                    ref={mainImg}
                    onMouseEnter={showExpand}
                    onMouseLeave={hideExpand}
                  />
                  <i id={s.aR} class="fas fa-chevron-right"></i>
                  <i
                    id={s.expand}
                    class="fas fa-expand"
                    ref={expand}
                    onClick={handleExpand}
                    onMouseEnter={showExpand}
                    onMouseLeave={hideExpand}
                  ></i>
                </div>
                <div
                  id={s.articleImagesRest}
                  onClick={(e) => handleThumbnail(e)}
                >
                  {arr
                    ? arr.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          ref={(imgs) => {
                            thumbImgs.push(imgs);
                          }}
                        />
                      ))
                    : null}
                </div>
              </div>
              <div id={s.comments} ref={comments}>
                <div id={s.commentsHeader}>
                  <span id={s.cL}></span>
                  <h2>
                    Comments <span>29</span>
                  </h2>
                  <div id={s.commentForm}>
                    <textarea
                      id={s.commentEnter}
                      ref={commentEnter}
                      maxLength="500"
                      placeholder="Type in your comment"
                      name="textarea"
                    ></textarea>
                    <div id={s.fB}>
                      <i class="fas fa-pencil-alt"></i>
                      <button
                        type="submit"
                        value="Submit comment"
                        onClick={saveComment}
                      >
                        Submit comment
                      </button>
                    </div>
                  </div>
                </div>
                <div id={s.commentBody}>
                  {commentsState.map((comm, i) => {
                    return (
                      <MainComment
                        key={uuid()}
                        ky={comm.ky}
                        usr={comm.user}
                        txt={comm.text}
                        rsp={comm.response} //odgovori
                        likeOp={comm.like}
                        dislikeOp={comm.dislike}
                        setRsp={{
                          trigger,
                          commentsState,
                          commentsResp,
                          setCommentsResp,
                          setCommentsState,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ArticleSite);
