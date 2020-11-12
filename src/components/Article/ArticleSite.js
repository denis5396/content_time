import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/User';
import { db, storage } from '../../firebase';
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
  const designTitle = useRef();
  const optDiv = useRef();
  const changeRemove = useRef();

  let thumbImgs = useRef();

  const [commentsState, setCommentsState] = useState([]);
  const [commentsResp, setCommentsResp] = useState([]);
  const [trigger, setTrigger] = useState(false);

  const [arr, setArr] = useState([]);
  const [ky, setKy] = useState([]);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [articleTxt, setArticleTxt] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [comLength, setComLength] = useState(0);

  // bcuz on rerender cnt would be zero so i had to make it stateful
  const [cnt, setCnt] = useState(0);

  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [thumbImgRemoved, setThumbImgRemoved] = useState(false);

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
      setTitle(snapshot.child('title').val());
      setSubTitle(snapshot.child('subTitle').val());
      setArticleTxt(snapshot.child('text').val());
      setArticleCategory(snapshot.child('category').val());
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
    if (window.innerWidth <= 500) {
      const height = scrollHeightOne.current.children[1].children[2].height;
      mainImg.current.parentElement.style.height = height;
    }
    if (window.innerWidth >= 1400) {
      if (scrollHeightOne.current) {
        const height = scrollHeightOne.current.children[1].children[2].height;
        console.log(mainImg.current.parentElement);
        mainImg.current.parentElement.style.height = `${height} px`;
      }
    }
    console.log(queryParam);
    console.log(url);
    //  scrollOffset.current.style.scrollBehavior = 'smooth'
  }, []);
  useEffect(() => {
    handleScroll();
    // console.log(articleTitle);{}
  });

  useEffect(() => {
    if (articleCategory) {
      console.log(articleCategory);
      if (window.innerWidth <= 779) {
        console.log(articleCategory);
        scrollOffset.current.children[0].style.backgroundColor =
          articleCategory === 'news'
            ? '#ff005c'
            : articleCategory === 'sports'
            ? '#ffc000'
            : articleCategory === 'lifestyle'
            ? '#673ab7'
            : articleCategory === 'technology'
            ? '#07b0d7'
            : 'initial';
        scrollOffset.current.children[1].style.backgroundColor =
          articleCategory === 'news'
            ? '#ff005c'
            : articleCategory === 'sports'
            ? '#ffc000'
            : articleCategory === 'lifestyle'
            ? '#673ab7'
            : articleCategory === 'technology'
            ? '#07b0d7'
            : 'initial';
      }
    }
  }, [articleCategory]);

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
              let comL = 0;
              console.log(key);
              const arr = snapshot.child(`comments`).val();
              console.log(arr);
              for (let i = 0; i < arr.length; i++) {
                comL += 1;
                if (arr[i].response) {
                  comL += arr[i].response.length;
                }
              }
              console.log(comL);
              setComLength(comL);
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
    if (commentEnter.current.value) {
      const text = commentEnter.current.value;
      const id = uuid();
      setKy((prev) => {
        return [...prev, id];
      });
      setCommentsState((prevCom) => {
        return [...prevCom, { ky: id, user, text, response: [] }];
      });
      commentEnter.current.value = '';
    }
  };

  useEffect(() => {
    if (arr.length > 0) {
      changeRemove.current.style.display = 'grid';
      changeRemove.current.nextSibling.style.display = 'block';
    }
    if (arr.length === 1 && thumbImgs[0] && adding) {
      thumbImgs[0].style.border = '0.3rem solid lightseagreen';
    }
    if (arr && thumbImgs[0] && !adding) {
      thumbImgs[0].style.border = '0.3rem solid lightseagreen';
      console.log(thumbImgs);
    }
    if (arr && thumbImgs[0] && removed) {
      let bool = false;
      thumbImgs.forEach((img, idx) => {
        if (img.style.border !== 'none' && !bool) {
          bool = true;
          mainImg.current.src = img.src;
        }
        if (!bool && idx === thumbImgs.length - 1) {
          thumbImgs[idx].style.border = '0.3rem solid lightseagreen';
          mainImg.current.src = thumbImgs[idx].src;
          setCnt(thumbImgs.length - 1);
        }
      });
    }
    if (arr.length === 0 && thumbImgs.length === 0 && removed) {
      changeRemove.current.style.display = 'none';
      changeRemove.current.nextSibling.style.display = 'none';
      setThumbImgRemoved(true);
      mainImg.current.src = '';
    }
  }, [arr]);

  const handleOrientation = () => {
    console.log('changed');
    if (articleCategory) {
      console.log(articleCategory);
      if (window.screen.width <= 779) {
        console.log('changed2');
        if (scrollOffset.current) {
          scrollOffset.current.children[0].style.backgroundColor =
            articleCategory === 'news'
              ? '#ff005c'
              : articleCategory === 'sports'
              ? '#ffc000'
              : articleCategory === 'lifestyle'
              ? '#673ab7'
              : articleCategory === 'technology'
              ? '#07b0d7'
              : 'initial';
          scrollOffset.current.children[1].style.backgroundColor =
            articleCategory === 'news'
              ? '#ff005c'
              : articleCategory === 'sports'
              ? '#ffc000'
              : articleCategory === 'lifestyle'
              ? '#673ab7'
              : articleCategory === 'technology'
              ? '#07b0d7'
              : 'initial';
        }
      } else if (window.screen.width >= 780) {
        if (scrollOffset.current) {
          scrollOffset.current.children[0].style.backgroundColor = 'initial';
        }
      }
    }
  };
  window.addEventListener('orientationchange', handleOrientation);
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

  const handleSlider = (e) => {
    let count = cnt;
    const { id } = e.target;
    // console.log(thumbImgs[count].style.border);
    // console.log(count);
    if (thumbImgs.length !== 0) {
      if (id.includes('aL') && arr.length !== 1) {
        if (count === 0) {
          count = thumbImgs.length - 1;
          setCnt(count);
        } else {
          count--;
          setCnt(count);
        }
        if (count === thumbImgs.length - 1) {
          thumbImgs[0].style.border = 'none';
        } else {
          thumbImgs[count + 1].style.border = 'none';
        }
        thumbImgs[count].style.border = '0.3rem solid lightseagreen';
        mainImg.current.src = thumbImgs[count].src;
      } else if (id.includes('aR') && arr.length !== 1) {
        count++;
        setCnt(count);
        console.log(count);
        console.log(thumbImgs.length);
        console.log(thumbImgs[0].style.border);
        if (
          count === thumbImgs.length &&
          thumbImgs[thumbImgs.length - 1].style.border !== ''
        ) {
          count = 0;
          setCnt(0);
        } else if (
          // handle last img active removed then added new one and click next into not undefined
          count === thumbImgs.length &&
          thumbImgs[thumbImgs.length - 1].style.border === ''
        ) {
          count = thumbImgs.length - 1;
          setCnt(count);
        }
        if (count === 0) {
          thumbImgs[thumbImgs.length - 1].style.border = 'none';
        } else {
          thumbImgs[count - 1].style.border = 'none';
        }
        thumbImgs[count].style.border = '0.3rem solid lightseagreen';
        mainImg.current.src = thumbImgs[count].src;
      }
    }
  };

  const showExpand = () => {
    expand.current.style.display = 'block';
  };
  const hideExpand = () => {
    expand.current.style.display = 'none';
  };

  const handleThumbnail = (e) => {
    let count = cnt;
    if (e.target.src) {
      console.log(e.target.src);
      thumbImgs.forEach((thumbImg) => {
        thumbImg.style.border = 'none';
      });
      thumbImgs.forEach((thumbImg, idx) => {
        if (thumbImg.src === e.target.src) {
          console.log(idx);
          count = idx;
          setCnt(count);
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
    let count = cnt;
    console.log(e.target);
    const { id } = e.target;
    if (id.includes('overlay') && e.target.nodeName !== 'IMG') {
      overlay.current.style.display = 'none';
    }
    if (id.includes('oR')) {
      count++;
      setCnt(count);
      if (count === thumbImgs.length) {
        count = 0;
        setCnt(0);
      }
      overlayImg.current.src = thumbImgs[count].src;
    } else if (id.includes('oL')) {
      if (count === 0) {
        count = thumbImgs.length - 1;
        setCnt(count);
      } else {
        count--;
        setCnt(count);
      }
      overlayImg.current.src = thumbImgs[count].src;
    }
  };

  const editTitles = (e) => {
    console.log(designTitle.current.children[1]);
    console.log(e.target.textContent);
    if (designTitle.current.children[0].contains(e.target)) {
      setTitle(e.target.value);
    } else if (designTitle.current.children[1].contains(e.target)) {
      setSubTitle(e.target.value);
    }
  };

  const openOptions = () => {
    if (optDiv.current) {
      if (!optDiv.current.style.display) {
        optDiv.current.style.display = 'block';
      } else if (optDiv.current.style.display === 'none') {
        optDiv.current.style.display = 'block';
      } else {
        optDiv.current.style.display = 'none';
      }
    }
  };

  const removeOpt = (e) => {
    const { id } = e.target;
    console.log(e.target);
    if (
      !id.includes('optDiv') &&
      !id.includes('dot') &&
      !id.includes('options') &&
      !optDiv.current.contains(e.target)
    ) {
      optDiv.current.style.display = 'none';
    }
  };

  const handleSelect = (e) => {
    console.log(e.target.value);
    setArticleCategory(e.target.value);
  };

  const adjustTxtarea = (e) => {
    e.target.style.height = '1px';
    e.target.style.height = 25 + e.target.scrollHeight + 'px';
    console.log(e.target.value);
    setArticleTxt(e.target.value);
  };

  const handleChangePic = (e) => {
    const { files } = e.target;
    const oldUrl = mainImg.current.src;
    let num = 0;
    setLoading(true);
    if (files[0]) {
      const uploadTask = storage.ref(`images/${files[0].name}`).put(files[0]);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(files[0].name)
            .getDownloadURL()
            .then((url) => {
              setLoading(false);
              setAdding(true);
              const newArr = [];

              thumbImgs.forEach((img, idx) => {
                console.log(img);
                if (img) {
                  newArr[idx] = thumbImgs[idx].src;
                  console.log(oldUrl);
                  if (oldUrl === img.src) {
                    newArr[idx] = url;
                  }
                }
              });
              mainImg.current.src = url;

              console.log(newArr);
              setArr([...newArr]);
            });
        }
      );
    }
  };
  const handleRemovePic = () => {
    const oldUrl = mainImg.current.src;
    console.log(oldUrl);
    const newArr = [...arr];
    let deletedPosition = 0;
    newArr.forEach((img, idx) => {
      console.log(img);
      if (img) {
        if (oldUrl === img) {
          newArr.splice(idx, 1);
          deletedPosition = idx;
        }
      }
    });
    setRemoved(true);
    console.log(newArr);
    setArr([...newArr]);
  };

  const handleMultipleImages = (e) => {
    const { files } = e.target;
    const arrFiles = [];
    console.log('haha');
    let countFiles = 0;
    if (files) {
      for (let file in files) {
        console.log(files[file]);
        if (countFiles < files.length) {
          arrFiles.push(files[file]);
        }
        countFiles++;
      }
    }
    let bool = false;
    // alert('anything');
    arrFiles.forEach((img) => {
      const uploadTask = storage.ref(`images/${img.name}`).put(img);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(img.name)
            .getDownloadURL()
            .then((url) => {
              bool = true;
              setAdding(true);
              setArr((prevArr) => {
                return [...prevArr, url];
              });
            });
        }
      );
      // if (!bool) {
      //   alert('xd');
      //   storage
      //     .ref('images')
      //     .child(img.name)
      //     .getDownloadURL()
      //     .then((url) => {
      //       alert(url);
      //       // setAdding(true);
      //       // setArr((prevArr) => {
      //       //   return [...prevArr, url];
      //       // });
      //     });
      // }
    });
    e.target.value = '';
    console.log(arrFiles);
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
      <div id={s.articleId} onClick={(e) => removeOpt(e)}>
        <div
          id={s.articleDesign}
          style={{
            backgroundColor:
              articleCategory === 'news'
                ? '#ff005c'
                : articleCategory === 'sports'
                ? '#ffc000'
                : articleCategory === 'lifestyle'
                ? '#673ab7'
                : articleCategory === 'technology'
                ? '#07b0d7'
                : 'initial',
          }}
        >
          <div id={s.designHeader}>
            <span
              style={{
                cursor: 'pointer',
              }}
              onClick={() =>
                document
                  .querySelector('body')
                  .classList.remove('visible-scrollbar')
              }
            >
              <i class="fas fa-arrow-left"></i> Back to articles
            </span>
            <span id={s.options} onClick={openOptions}>
              <span id={s.dot} />
            </span>
            <div id={s.optDiv} ref={optDiv}>
              <ul>
                <li>Change Category</li>
                <select
                  value={articleCategory}
                  onChange={(e) => handleSelect(e)}
                >
                  <option value="news">News</option>
                  <option value="sports">Sports</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="technology">Technology</option>
                </select>
                <li>Save Changes</li>
              </ul>
            </div>
            <div id={s.designTitle} ref={designTitle}>
              {user === 'admin' ? (
                <>
                  <textarea
                    spellCheck={false}
                    autoFocus
                    onChange={editTitles}
                    value={title ? title : ''}
                    style={{
                      backgroundColor:
                        articleCategory === 'news'
                          ? '#ff005c'
                          : articleCategory === 'sports'
                          ? '#ffc000'
                          : articleCategory === 'lifestyle'
                          ? '#673ab7'
                          : articleCategory === 'technology'
                          ? '#07b0d7'
                          : 'initial',
                    }}
                  />
                  <textarea
                    spellCheck={false}
                    autoFocus
                    onChange={editTitles}
                    value={subTitle ? subTitle : ''}
                    style={{
                      backgroundColor:
                        articleCategory === 'news'
                          ? '#ff005c'
                          : articleCategory === 'sports'
                          ? '#ffc000'
                          : articleCategory === 'lifestyle'
                          ? '#673ab7'
                          : articleCategory === 'technology'
                          ? '#07b0d7'
                          : 'initial',
                    }}
                  ></textarea>
                </>
              ) : (
                <>
                  <h1>{title ? title : ''}</h1>
                  <h5>{subTitle ? subTitle : ''}</h5>
                </>
              )}
            </div>
            {articleCategory === 'news' ? (
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
            ) : null}
            {articleCategory === 'sports' ? (
              <span id={s.x}>
                <span id={s.x1} />
                <span id={s.x2} />
                <span id={s.x3} />
                <span id={s.x4} />
                <span id={s.x5} />
                <span id={s.x6} />
                <ul>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                  <li class={s.xLine}></li>
                </ul>
              </span>
            ) : null}
            {articleCategory === 'lifestyle' ? (
              <span id={s.triangle}>
                <span id={s.hideL} />
                <span id={s.hideR} />
                <span id={s.triangleIn} />
                <ul id={s.triangleUl}>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <span id={s.triangleHide} />
              </span>
            ) : null}
            {articleCategory === 'technology' ? (
              <span id={s.square}>
                <span id={s.squareHide} />
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </span>
            ) : null}
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
          <div id={s.mobileTitle}>
            <h2>{title ? title : ''}</h2>
            <h5>{subTitle ? subTitle : ''}</h5>
          </div>
          <div id={s.articleSliderParent}>
            <div id={s.one} ref={scrollHeightOne}>
              <div id={s.scroll}>
                <div id={s.progressBar} ref={progressBar}></div>
                <div id={s.scrollPath}></div>
              </div>
              <div id={s.body}>
                <span id={s.line} />
                <h2>About this article</h2>
                <img
                  src={require('../../assets/img/ecommerce.jpg')}
                  style={{ marginTop: '2rem' }}
                />
                {user === 'admin' ? (
                  <textarea
                    id={s.txtAr}
                    onChange={(e) => adjustTxtarea(e)}
                    style={{ lineHeight: '2.6rem' }}
                    spellCheck={false}
                    value={articleTxt}
                  ></textarea>
                ) : (
                  <p className={s.ptext}>{articleTxt ? articleTxt : ''}</p>
                )}
              </div>
              <div id={s.articleImages}>
                <span id={s.mline} />
                <h2 style={{ marginBottom: '2rem' }}>Images</h2>
                {user === 'admin' ? (
                  <div id={s.addImagesParent}>
                    <div id={s.addImages}>
                      <button>+</button>
                      <input
                        type="file"
                        onChange={(e) => handleMultipleImages(e)}
                        accept="image/*"
                        multiple={true}
                      />
                    </div>
                    <span id={s.addMoreSpan}>Add more images</span>
                  </div>
                ) : null}
                {user === 'admin' ? (
                  <div id={s.changeRemove} ref={changeRemove}>
                    <div id={s.change}>
                      <button id={s.changePic}>Change Image</button>
                      <input type="file" onChange={(e) => handleChangePic(e)} />
                    </div>
                    <div id={s.remove}>
                      <button id={s.removePic} onClick={handleRemovePic}>
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : null}
                <div id={s.articleImagesMain} onClick={handleSlider}>
                  <i id={s.aL} class="fas fa-chevron-left"></i>
                  {loading ? (
                    <div id={s.spinnerImg}></div>
                  ) : (
                    <img
                      src={imageUrls[0] ? imageUrls[0] : ''}
                      ref={mainImg}
                      onMouseEnter={showExpand}
                      onMouseLeave={hideExpand}
                    />
                  )}
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
                    Comments <span>{comLength ? comLength : 0}</span>
                  </h2>
                  <div id={s.commentForm}>
                    <textarea
                      id={s.commentEnter}
                      ref={commentEnter}
                      maxLength="500"
                      placeholder="Type in your comment..."
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
                        key={i}
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
