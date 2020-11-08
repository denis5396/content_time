import React, { useRef, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import s from './Article.module.css';

const Article = (props) => {
  const optionsParent = useRef();
  const rCO = useRef();
  const articleBox = useRef();
  const [open, setOpen] = useState(true);

  const handleClick = (e) => {
    if (articleBox.current.contains(e.target)) {
      // inside click
      setOpen(true);
      return;
    }
    // outside click
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const openOptions = (e) => {
    const strVal = e.target.id;
    console.log(strVal);
    if (
      strVal.includes('optionsParent') ||
      strVal.includes('options') ||
      strVal.includes('o1') ||
      strVal.includes('o2')
    ) {
      if (rCO.current.style.display === 'flex') {
        rCO.current.style.display = 'none';
      } else {
        rCO.current.style.display = 'flex';
      }
    } else if (
      strVal.includes('mainBox') ||
      strVal.includes('articleImg') ||
      strVal.includes('o') ||
      strVal.includes('x') ||
      strVal.includes('triangle') ||
      strVal.includes('square')
    ) {
      rCO.current.style.display = 'none';
    }
  };

  const editArticleHandler = (articleId) => {
    const articleIds = props.ids.articleIds;
  };

  const deleteArticleHandler = (articleId) => {
    const articleIds = props.ids.articleIds;
    console.log(articleIds);
    articleIds.forEach((art, idx) => {
      if (art === articleId) {
        articleIds.splice(idx, 1);
      }
    });
    console.log(articleIds);
    props.ids.setArticleIds([...articleIds]);
    props.ids.setArticleRemoved(true);

    const projectRef = db.ref(`/content/${articleId}`);
    projectRef.remove();
    // console.log(projectRef)
  };

  return (
    <div
      id={s.mainBox}
      style={{
        backgroundColor:
          props.category === 'sports'
            ? '#ffc000'
            : props.category === 'lifestyle'
            ? '#673ab7'
            : props.category === 'news'
            ? '#ff005c'
            : props.category === 'technology'
            ? '#07b0d7'
            : '',
      }}
      ref={articleBox}
      onClick={(e) => openOptions(e)}
    >
      {open && (
        <span id={s.rCO} ref={rCO}>
          <span onClick={() => deleteArticleHandler(props.uId)}>
            Delete Article<i class="fas fa-trash-alt"></i>
          </span>
          <Link to={`/article/${props.uId}`}>
            <span>
              Edit Article<i class="fas fa-edit"></i>
            </span>
          </Link>
        </span>
      )}
      <span id={s.optionsParent} ref={optionsParent}>
        <span id={s.options} />
        <span id={s.o1} />
        <span id={s.o2} />
      </span>
      <img src={props.imageUrl[0]} id={s.articleImg} />
      <span id={s.boxTitle}>
        <span
          id={s.line}
          style={{
            backgroundColor:
              props.category === 'sports'
                ? '#4b3808'
                : props.category === 'technology'
                ? '#063d58'
                : '',
          }}
        />
        <span id={s.title}>
          <h4
            style={{
              color:
                props.category === 'sports'
                  ? '#333'
                  : props.category === 'technology'
                  ? '#333'
                  : '',
            }}
          >
            {props.title}
          </h4>
          <p
            style={{
              color:
                props.category === 'sports'
                  ? '#333'
                  : props.category === 'technology'
                  ? '#333'
                  : '',
              fontWeight:
                props.category === 'sports'
                  ? 'bolder'
                  : props.category === 'technology'
                  ? 'bolder'
                  : '',
            }}
          >
            {props.subTitle}
          </p>
        </span>
      </span>
      {props.category === 'news' ? (
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
          </ul>
        </span>
      ) : null}

      {props.category === 'sports' ? (
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
          </ul>
        </span>
      ) : null}
      {props.category === 'technology' ? (
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
      {props.category === 'lifestyle' ? (
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
          </ul>
          <span id={s.triangleHide} />
        </span>
      ) : null}
    </div>
  );
};

export default Article;
