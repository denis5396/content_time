import React, {useRef, useEffect, useState, useContext, createContext} from 'react'
import { storage } from '../../firebase'
import { Link } from 'react-router-dom'
import Nav from '../nav/Nav'
import Article from '../Article/Article'
import s from './Home.module.css'
import { UserContext } from '../../contexts/User'
import {v1 as uuid} from "uuid"; 


const Home = () => {

  const {user, setUser} = createContext(UserContext)

  const overlay = useRef()
  let labels = useRef()
  let inputs = useRef()
  const selectValue = useRef()
  const alertNoImg = useRef()
  const spinnerParent = useRef()
  const articleSpinner = useRef()
  const articleUploadText = useRef()
  const articleForm = useRef()
  const bgParent = useRef()

  const [init, setInit] = useState(true)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [article, setArticle] = useState({title: '', subTitle: '', category: '', imageUrl: '', text: ''})
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  // get articles
  const [articles, setArticles] = useState([])
  const [freeToGet, setFreeToGet] = useState(false)
  const [disableSpinner, setDisableSpinner] = useState(true)

  const getArticles =  () => {
    fetch('https://contenttime-90543.firebaseio.com/content.json')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(articles.length)
      if(data){
        const keys = Object.keys(data)
        if(articles.length === 0){
          for(let id in data){
            console.log(data[id]) 
            setArticles(oldArray => [...oldArray, data[id]])
          }
        }
        else if(articles.length > 0) {
          setArticles(oldArray => [...oldArray, data[keys[keys.length - 1]]])
        }
      }
    }).then(success => {
      setDisableSpinner(false)
    })
  }

  useEffect(() => {
    getArticles()
    
  }, [])
  useEffect(() => {
    if(loading){
      articleSpinner.current.style.opacity = '1'
      articleSpinner.current.style.display = 'block'
    }
    
  }, [loading])
  useEffect(() => {
    if(freeToGet){
      getArticles()
      setFreeToGet(false)
      resetFields()
    }
  }, [freeToGet])

  useEffect(() => {
    if(ready) {
      article.imageUrl = imageUrl
      console.log(article)
      fetch('https://contenttime-90543.firebaseio.com/content.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })
      .then(response => {
        response.json()
        setLoading(false)
        articleUploadText.current.style.display = 'block'
        spinnerParent.current.style.zIndex = '12'
        setTimeout(() => {
          articleUploadText.current.style.opacity = '0'
        }, 1500)
        setTimeout(() => {
          spinnerParent.current.style.zIndex = '-1'
        }, 2000)
        setFreeToGet(true)
      })
      .then(article => {
        console.log('Success:', article);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [imageUrl])
  labels = undefined;
  inputs = undefined;
    if (!labels) {
      labels = [];
    } else {
      setInit(false)
    }
    if(!inputs) {
      inputs = []
    } else {
      setInit(false)
    }

    const handleFocus = (name) => {
      labels.forEach((label, idx) => {
        if(name === 'title' && idx === 0){
          label.style.marginBottom = '0'
          handleFalseInputs(inputs[0])
          inputs[0].style.borderBottom = '.1rem solid #4353a0'
        } else if(name === 'subtitle' && idx === 1){
          label.style.marginBottom = '0'
          handleFalseInputs(inputs[1])
          inputs[1].style.borderBottom = '.1rem solid #4353a0'
        }
        })
        if(name === 'textarea') {

            inputs[3].style.border = '.1rem solid #4353a0'

        }
    }
    const handleBlur = (e, name) => {
      labels.forEach((label, idx) => {
        if(!e.target.value && idx === 0 && name === 'title'){
          label.style.marginBottom = '-2rem'
          inputs[0].style.borderBottom = '.1rem solid #ccc'
        } else if(!e.target.value && idx === 1 && name === 'subtitle'){
          label.style.marginBottom = '-2rem'
          inputs[1].style.borderBottom = '.1rem solid #ccc'
        }
      })
    }
    const handleSubmit = (e) => {
      e.preventDefault()
      let bool = true
      inputs.forEach((input, idx) => {
        if(input.value === '' && idx !== 2 && idx !== 3) {
          input.value = 'This input field is required!'
          input.style.color = 'red'
          input.style.borderBottom = '.1rem solid red'
          labels[0].style.marginBottom = '0rem'
          labels[1].style.marginBottom = '0rem'
          bool = false;
        } else if(input.value === '' && idx === 3){
          input.value = 'This input field is required!'
          input.style.color = 'red'
          input.style.border = '.1rem solid red'
          bool = false;
        } else if(input.value === '' && idx === 2) {
          alertNoImg.current.style.display = 'inline-block'
          bool = false;
        }
      })
      if(bool) {
        spinnerParent.current.style.display = 'block'
        spinnerParent.current.style.zIndex = '12'
        setArticle({title: inputs[0].value, subTitle: inputs[1].value, category: selectValue.current.value, imageUrl: '', text: inputs[3].value })
        handleUpload()
        setReady(true)
        setLoading(true)
      }
    }
  
    const handleFalseInputs = (node) => {
      if(node.value === 'This input field is required!'){
        node.value = ''
        node.style.color = 'initial'
      }
    }

    // firebase img upload
    const handleChange = (e) => {
      alertNoImg.current.style.display='none'
      if(e.target.files[0]) {
        setImage(e.target.files[0])
      }
    }

    const handleUpload =  () => {
      if(image){
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log(error)
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              setImageUrl(url)
            })
        }
      )
      }
    }

    const handleAddArticle = () => {
      disableScroll()
      document.querySelector('html').style.scrollBehavior = 'smooth'
      window.scrollTo(0, 0)
      document.querySelector('html').style.overflowY = 'hidden'
      articleForm.current.style.transform = 'translate(-50%, -50%)'
      articleForm.current.style.opacity = '1'
      articleForm.current.style.zIndex = '11'
      overlay.current.style.display = 'block'
    }

    const closeEverything = () => {
      enableScroll()
      document.querySelector('html').style.overflowY = 'scroll'
      articleForm.current.style.opacity = 0
      articleForm.current.style.transform = 'translate(-50%, -100%)'
      articleForm.current.style.zIndex = -1;
      overlay.current.style.display = 'none'
      spinnerParent.current.style.display = 'none'
      resetFields()
  }

  const resetFields = () => {
    inputs.forEach((input, idx) => {
      if(idx !== 2 && idx !== 3) {
        input.value = ''
        input.style.color = 'initial'
        input.style.borderBottom = '.1rem solid #ccc'
        labels[0].style.marginBottom = '-2rem'
        labels[1].style.marginBottom = '-2rem'
      } else if(idx === 3){
        input.value = ''
        input.style.color = 'initial'
        input.style.border = '.1rem solid #4353a0'
      } else if(idx === 2) {
        input.value = ''
        alertNoImg.current.style.display = 'none'
      }
  })
  }

  function preventDefault(e){
    e.preventDefault();
  }

  function disableScroll(){
    document.body.addEventListener('touchmove', preventDefault, { passive: false });  
  }
  function enableScroll(){
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
  }

  return (
    <div id={s.bg} ref={bgParent}>
      <div id={s.overlay} ref={overlay} onClick={closeEverything}/>
      <div id={s.spinnerParent} ref={spinnerParent}>
      {loading ? <div id={s.articleSpinner} ref={articleSpinner}></div> : <div id={s.articleUploaded} ref={articleUploadText}><i className="fas fa-check"></i>Your article has been created!</div>}
      </div>
      <form id={s.createArticle} onSubmit={(e) => handleSubmit(e)} ref={articleForm}>
        <h2>Create Your Own Article</h2>
        <label ref={(label) => {
                  if (labels.length < 2 && label && init) {
                    labels.push(label);
                  }
                }} class={s.nl} htmlFor="title">Title</label>
        <input ref={(input) => {
          if(inputs.length < 4 && input && init) {
            inputs.push(input)
          }
        }} autoComplete="off" onBlur={(e) => handleBlur(e, 'title')} onFocus={() => handleFocus('title')} type="text" name="title"/>
        <label class={s.nl} ref={(label) => {
                  if (labels.length < 2 && label && init) {
                    labels.push(label);
                  }
                }} htmlFor="subtitle">Subtitle</label>
        <input ref={(input) => {
          if(inputs.length < 4 && input && init) {
            inputs.push(input)
          }
        }} autoComplete="off" type="text" onBlur={(e) => handleBlur(e, 'subtitle')} onFocus={() => handleFocus('subtitle')} name="subtitle"/>
        <label id={s.selectLabel}htmlFor="type">Choose the category that fits your article:</label>
        <select name="type" ref={selectValue}>
          <option value="news">News</option>
          <option value="sports">Sports</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="technology">Technology</option>
        </select>
        <label htmlFor="img">Upload an image:</label>
        <input onChange = {(e) => handleChange(e)} ref={(input) => {
          if(inputs.length < 4 && input && init) {
            inputs.push(input)
          }
        }} type="file" id={s.imgUpload} name="img" accept="image/*"/>
        <span id={s.showNoImg} ref={alertNoImg}>Please upload an image.</span>
        <label htmlFor="textarea">Insert the text for your article:</label>
        <textarea onFocus={(e) => {
         handleFalseInputs(e.target)
         handleFocus('textarea')
        }} ref={(input) => {
          if(inputs.length < 4 && input && init) {
            inputs.push(input)
          }
        }} maxLength="5000" placeholder="Your text..." name="textarea"/>
        <input id={s.submitArticle} type="submit" value="Submit"/>
      </form>
      <Nav />
      <section id={s.creation}>
        <div id={s.articles}>
          <div id={s.articlesTitle}>
            <h3>Articles <span>{articles.length}</span></h3>
          </div>
          <div id={s.articlesBody}>
            <button id={s.addArticle} onClick={handleAddArticle}>+</button>
            {!disableSpinner ? (<div id={s.addedArticles}>
              {articles ? articles.map(art => 
                 (<Article key={uuid()} title={art.title} subTitle={art.subTitle} category={art.category} imageUrl={art.imageUrl} text={art.text} /> )
              ) : null}
            </div>) : (<div id={s.preLoad}></div>)}
          </div>
        </div>
      </section>
      <ul id={s.bgLines}>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
      </ul>
      <ul id={s.bgLines2}>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
      </ul>
      <ul id={s.bgLines3}>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
      </ul>
      <span id={s.triangleP}>
        <span id={s.triangleH} />
        <span id={s.triangleInH} />
      </span>

      <span id={s.squareH}>
        <span id={s.squareHideH} />
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
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
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
      <span id={s.xH}>
        <span id={s.x1H} />
        <span id={s.x2H} />
        <span id={s.x3H} />
        <span id={s.x4H} />
        <span id={s.x5H} />
        <span id={s.x6H} />
        <span id={s.x7H} />
        <span id={s.x8H} />
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
        </ul>
      </span>
    </div>
  )
}

export default Home