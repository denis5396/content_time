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
  const txtAr = useRef();

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
  const [addedLast, setAddedLast] = useState(0);
  const [loadingImg, setLoadingImg] = useState([]);
  const [changed, setChanged] = useState(false);

  const [enter, setEnter] = useState(false);
  const [backspace, setBackspace] = useState(false);

  const [generatePs, setGeneratePs] = useState([]);
  const [arrived, setArrived] = useState(false);
  const [selStart, setSelStart] = useState(0);

  // when clicked on inbetween empty rows bool state
  const [inbetween, setInbetween] = useState(false);

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
    thumbImgs.forEach((img, idx) => {
      if (img.style.border !== 'none' && img.style.border !== '') {
        if (mainImg.current) {
          alert('why');
          mainImg.current.src = arr[idx];
        }
      }
    });
    // HANDLE DELETE ALL THEN ADD ALL MAINIMGSRC SPINNER
    let tst = false;
    arr.forEach((img, idx) => {
      if (
        img !== 'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif'
      ) {
        tst = true;
      }
      if (idx === arr.length - 1 && !tst) {
        mainImg.current.src =
          'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif';
      }
    });
    if (changed) {
      if (changed && arr.length !== 1) {
        thumbImgs[0].style.border = '';
      }
    }
  }, [loading]);

  useEffect(() => {
    if (removed) {
      if (arr.length === 1 && thumbImgs[0]) {
        thumbImgs[0].style.border = '0.3rem solid lightseagreen';
      }
    }
  }, [removed]);

  useEffect(() => {
    if (arr.length === addedLast) {
      setLoading(false);
      const ldImg = [];
      loadingImg.forEach((loadImg, idx) => {
        ldImg[idx] = loadImg;
        if (loadImg) {
          ldImg[idx] = false;
        }
      });
      setLoadingImg([...ldImg]);
    }
    if (arr.length > 0) {
      changeRemove.current.style.display = 'grid';
      changeRemove.current.nextSibling.style.display = 'block';
    }
    if (arr.length > 1 && thumbImgs[0] && changed) {
      if (mainImg.current.src === thumbImgs[0].src) {
        thumbImgs[0].style.border = '0.3rem solid lightseagreen';
      } else {
        thumbImgs[0].style.border = '';
      }
    }
    if (arr.length === 1 && thumbImgs[0] && adding) {
      thumbImgs[0].style.border = '0.3rem solid lightseagreen';
    }
    if (arr && thumbImgs[0] && !adding) {
      if (mainImg.current.src !== thumbImgs[0].src) {
        if (arr.length === 1) {
          thumbImgs[0].style.border = '0.3rem solid lightseagreen';
        } else {
          thumbImgs[0].style.border = '';
        }
      } else {
        thumbImgs[0].style.border = '0.3rem solid lightseagreen';
      }
      console.log(thumbImgs);
    }

    if (arr && thumbImgs[0] && removed && !loading) {
      let bool = false;
      thumbImgs.forEach((img, idx) => {
        if (img.style.border !== 'none' && img.style.border !== '' && !bool) {
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
  useEffect(() => {
    // if (enter) {
    //   // alert(txtAr.current.value.length);
    //   const str = txtAr.current.value;
    //   const pArray = [];
    //   let endIdx = 0;
    //   for (let i = 0; i < str.length; i++) {
    //     // if (str[i] !== oldStr[i]) {
    //     //   alert(i);
    //     //   pArray.push()
    //     //   setGeneratePs()
    //     //   break
    //     // }
    //     if (str[i] === '\n') {
    //       pArray.push(str.slice(endIdx, i));
    //       setGeneratePs([...pArray]);
    //       const rest = str.slice(i + 1);
    //       for (let j = 0; j < rest.length; j++) {
    //         if (rest[j] === '\n') {
    //           break;
    //         } else if (j === rest.length - 1) {
    //           pArray.push(rest);
    //           setGeneratePs([...pArray]);
    //         }
    //       }
    //       endIdx = i + 1;
    //       setArticleTxt(txtAr.current.value);
    //     }
    //   }
    // alert(oldStr.length);
    // const { value } = txtAr.current;
    // alert(value.length);
    // setArticleTxt(txtAr.current.value);
    // alert(articleTxt.length);
    // alert(oldStr.length);
    // }
  }, [enter]);
  useEffect(() => {
    if (generatePs.length > 0) {
      console.log(generatePs);
    }
  }, [generatePs]);

  const adjustTxtarea = (e) => {
    console.log(e.target);
    console.log(txtAr.current);
    e.target.style.height = '1px';
    e.target.style.height = 25 + e.target.scrollHeight + 'px';
    console.log(e.target.value);
    if (!enter) {
      setArticleTxt(e.target.value);
    }
    if (enter) {
      setArticleTxt(e.target.value);
      if (
        txtAr.current.value[selStart + 1] === '\n' &&
        txtAr.current.value[selStart + 2] === '\n' &&
        txtAr.current.value[selStart + 3] === '\n'
      ) {
        txtAr.current.selectionEnd = selStart + 2;
      }
    }
    const str = txtAr.current.value;
    console.log(str);
    const pArray = [];
    let endIdx = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '\n') {
        console.log(str.slice(endIdx, i));
        if (str.slice(endIdx, i) !== '') {
          pArray.push(str.slice(endIdx, i));
        }
        setGeneratePs([...pArray]);
        const rest = str.slice(i + 1);
        for (let j = 0; j < rest.length; j++) {
          if (rest[j] === '\n') {
            break;
          } else if (j === rest.length - 1) {
            pArray.push(rest);
            setGeneratePs([...pArray]);
          }
        }
        endIdx = i + 1;
        setArticleTxt(txtAr.current.value);
        setSelStart(txtAr.current.selectionStart);
        if (txtAr.current.value.length === selStart) {
          alert('haha');
        }
      }
    }
  };

  useEffect(() => {
    // if (arrived && enter) {
    //   const placeholderArr = [];
    //   alert('entered');
    //   let count = 0;
    //   console.log(articleTxt);
    //   for (let i = 0; i < articleTxt.length; i++) {
    //     placeholderArr[count] = articleTxt[i];
    //     count++;
    //     if (articleTxt[i] === '\n') {
    //       placeholderArr[count] = '\n';
    //       count++;
    //     }
    //   }
    //   console.log(placeholderArr.join(''));
    //   setArticleTxt(placeholderArr.join(''));
    // }
    // fix copy paste text, sometimes there was no new line after new line on imported txts
    if (txtAr.current && arrived) {
      const strin = txtAr.current.value;
      const newArr = [];
      let count = 0;
      for (let i = 0; i < strin.length; i++) {
        newArr[count] = strin[i];
        count++;
        if (strin[i] === '\n') {
          if (strin[i - 1] !== '\n') {
            if (strin[i + 1] !== '\n') {
              newArr[count] = '\n';
              count++;
            }
          }
          console.log('here');
        }
      }
      setArticleTxt(newArr.join(''));
      if (selStart !== 0) {
        // txtAr.current.selectionEnd = selStart;
      }
    }
  }, [arrived]);
  useEffect(() => {
    if (articleTxt && inbetween) {
      console.log(articleTxt.length);
      console.log(selStart);
      txtAr.current.style.height = '1px';
      txtAr.current.style.height = 25 + txtAr.current.scrollHeight + 'px';
      txtAr.current.selectionStart = selStart;
      txtAr.current.selectionEnd = selStart;
    }
  }, [articleTxt]);
  useEffect(() => {
    if (selStart !== 0 && enter) {
      // alert(selStart);
      // alert(txtAr.current.value.length);
      let bool = false;
      console.log(txtAr.current.value);
      for (let i = 0; i < txtAr.current.value.length; i++) {
        if (i === selStart) {
          alert(txtAr.current.value[i]);
          if (
            txtAr.current.value[i] === '\n' &&
            txtAr.current.value[i + 1] === '\n' &&
            txtAr.current.value[i + 2] !== '\n'
          ) {
            alert('rue');
            bool = true;
            txtAr.current.selectionEnd = i;
          } else if (
            txtAr.current.value[i + 1] === '\n' &&
            txtAr.current.value[i + 2] === '\n' &&
            txtAr.current.value[i + 3] === '\n'
          ) {
            alert('davaj');
          }
          if (selStart + 2 === txtAr.current.value.length) {
            txtAr.current.selectionStart = txtAr.current.value.length;
          }
        }
        if (!bool) {
          txtAr.current.selectionStart = txtAr.current.value.length;
        }
      }
    }
  }, [selStart]);
  const getEnters = (e) => {
    if (e.which === 8) {
      setBackspace(true);
    }
    if (e.which === 13) {
      setEnter(true);
      let strX = articleTxt;
      const selNum = txtAr.current.selectionStart;
      strX += '\n';
      if (txtAr.current.selectionStart === txtAr.current.value.length) {
        setArticleTxt(strX);
      } else if (txtAr.current.selectionStart < txtAr.current.value.length) {
        alert(txtAr.current.selectionStart);
        alert(txtAr.current.value.length);
        console.log(txtAr.current.value.split(''));
        const newArr = txtAr.current.value.split('');
        newArr.splice(txtAr.current.selectionStart, 0, '\n');
        newArr.splice(txtAr.current.selectionStart, 0, '\n');
        if (newArr[newArr.length - 1] === '\n') {
          newArr.splice(newArr.length - 1, 1);
        }
        console.log(newArr);
        setArticleTxt(newArr.join(''));
      }
      setSelStart(txtAr.current.selectionStart);
      //  else if (selNum < txtAr.current.value.length) {
      //   const newArr = [];
      //   let count = 0;
      //   let bool = false;
      //   for (let i = 0; i < strX.length; i++) {
      //     if (bool) {
      //       newArr[count] = strX[i - 1];
      //       count++;
      //       bool = false;
      //     }
      //     if (i !== selNum) {
      //       newArr[count] = strX[i];
      //       count++;
      //     }
      //     if (i === selNum) {
      //       bool = true;
      //       newArr[count] = '\n';
      //       count++;
      //     }
      //   }
      //   setArticleTxt(newArr.join(''));
      // }
    } else {
      setEnter(false);
      setArrived(false);
      const slNm = txtAr.current.selectionStart;
      if (
        txtAr.current.value[slNm] === '\n' &&
        txtAr.current.value[slNm - 1] === '\n' &&
        txtAr.current.value[slNm + 1] !== '\n'
      ) {
        setInbetween(true);
        alert('yes');
      } else {
        setInbetween(false);
      }
    }
  };

  useEffect(() => {
    if (inbetween) {
      const strArr = txtAr.current.value.split('');
      const slNm = txtAr.current.selectionStart;
      console.log(txtAr.current.value);
      if (strArr[slNm] === '\n' && strArr[slNm - 1] === '\n') {
      }
      setSelStart(slNm + 1);
      for (let i = 0; i < strArr.length; i++) {
        console.log(strArr[i]);
        if (slNm === i) {
          console.log(strArr[i - 2]); // i-1 curr typed letter
          console.log(strArr[i]);
          if (strArr[i - 2] === '\n' && strArr[i] === '\n') {
            alert(strArr[i - 1]); // starri-1 = curr typed letter i === cur space where next letter will be typed
            strArr.splice(i - 1, 0, '\n');
            strArr.splice(i + 1, 0, '\n');
          }
        }
      }
      console.log(strArr);
      setArticleTxt(strArr.join(''));
      txtAr.current.selectionStart = slNm + 1;
      txtAr.current.style.height = '1px';
      txtAr.current.style.height = 25 + txtAr.current.scrollHeight + 'px';
    }
  }, [inbetween]);

  const handleChangePic = (e) => {
    const { files } = e.target;
    const oldUrl = mainImg.current.src;
    let num = 0;
    setLoading(true);
    if (files[0]) {
      const thumbArr = [...arr];
      thumbImgs.forEach((img, idx) => {
        if (img.style.border !== 'none' && img.style.border !== '') {
          thumbArr[idx] =
            'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif';
          setArr([...thumbArr]);
        }
      });
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
              setChanged(true);
              const newArr = [...thumbArr];

              thumbImgs.forEach((img, idx) => {
                if (img) {
                  if (
                    img.src ===
                    'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif'
                  ) {
                    newArr[idx] = url;
                  }
                }
              });
              mainImg.current.src = url;
              thumbImgs[0].style.border = 'none';

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
    let countFiles = 0;
    let savePos = 0;
    const loadingImgArray = [];
    arr.forEach((ar, idx) => {
      loadingImgArray[idx] = false;
      savePos = idx;
    });

    if (files) {
      setLoading(true);
      for (let file in files) {
        console.log(files[file]);
        savePos++;
        if (countFiles < files.length) {
          arrFiles.push(files[file]);
          loadingImgArray[savePos] = true;
          setArr((prevArr) => {
            return [
              ...prevArr,
              'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif',
            ];
          });
        }
        countFiles++;
      }
    }
    const length1 = arr.length;
    const length2 = arrFiles.length;
    const prvA = [...arr];
    setLoadingImg([...loadingImgArray]);
    setAddedLast(arrFiles.length + arr.length);
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
              prvA.push(url);
              if (prvA.length === length1 + length2) {
                setArr([...prvA]);
              }
              setAdding(true);
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
                    ref={txtAr}
                    onChange={(e) => adjustTxtarea(e)}
                    onKeyDown={(e) => getEnters(e)}
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
                  {/* {loading ? (
                    <div id={s.spinnerImg}></div>
                  ) : (
                    <img
                      src={imageUrls[0] ? imageUrls[0] : ''}
                      ref={mainImg}
                      onMouseEnter={showExpand}
                      onMouseLeave={hideExpand}
                    />
                  )} */}
                  <img
                    src={
                      loading
                        ? 'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif'
                        : imageUrls[0]
                    }
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
                        <>
                          {/* {!loading ? (
                            <img
                              key={i}
                              src={img}
                              ref={(imgs) => {
                                thumbImgs.push(imgs);
                              }}
                            />
                          ) : (
                            <img
                              id={s.spinnerThumb}
                              style={{ backgroundColor: 'red' }}
                              src=""
                            ></img>
                          )} */}
                          <img
                            key={i}
                            src={
                              loadingImg[i]
                                ? 'https://media.giphy.com/media/3ov9jKQbfWvDNu2Z0s/giphy.gif'
                                : img
                            }
                            ref={(imgs) => {
                              thumbImgs.push(imgs);
                            }}
                          />
                        </>
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
