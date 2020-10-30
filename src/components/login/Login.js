import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../contexts/User';
import s from './Login.module.css';

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  const square = useRef();
  const triangle = useRef();
  const circle = useRef();
  const titleBox = useRef();
  const ul1 = useRef();
  const ul2 = useRef();
  const ul3 = useRef();
  const input1 = useRef();
  const input2 = useRef();
  const input11 = useRef();
  const input21 = useRef();
  const form = useRef();
  const spinner = useRef();
  const i1a = useRef();
  const accCreationBtn = useRef();
  const signInBtn = useRef();
  const inputHtml = useRef();
  const [init, setInit] = useState(true);
  const [accCreation, setAccountCreation] = useState(false);
  const [usernameSafe, setusernameSafe] = useState(false);
  const [passwordSafe, setpasswordSafe] = useState(false);
  const [firstInput, setFirstInput] = useState(false);
  const [secondInput, setSecondInput] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!input11.current.value && firstInput && accCreation && init) {
      input11.current.style.borderBottom = '1px solid #d93025';
      i1a.current.style.opacity = '1';
      i1a.current.style.transform = 'translateY(0rem)';
    } else if (!input11.current.value && firstInput && accCreation && !init) {
      if (input11.current.value.length < 3) {
        input11.current.style.borderBottom = '1px solid #d93025';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(0rem)';
        inputHtml.current.textContent =
          'Please enter a username that is at least 3 characters long.';
      } else if (input11.current.value.length > 16) {
        inputHtml.current.textContent =
          'Please enter a username that is not longer than 16 characters.';
        input11.current.style.borderBottom = '1px solid #d93025';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(0rem)';
      } else {
        input11.current.style.borderBottom = '1px solid lightgreen';
        i1a.current.style.opacity = '0';
        i1a.current.style.transform = 'translateY(-2rem)';
      }
    }
    if (firstInput && input11.current.value) {
      checkInput(input11.current.value);
    }
  }, [firstInput]);

  useEffect(() => {
    if (secondInput && accCreation) {
      checkInput(input21.current.value);
    }
  }, [secondInput]);

  useEffect(() => {
    if (accCreation) {
      accCreationBtn.current.style.background = '#3f51b5';
      accCreationBtn.current.style.color = '#fff';
      signInBtn.current.style.background = 'transparent';
      signInBtn.current.style.color = '#aaafb1';
      accCreationBtn.current.addEventListener('mouseenter', accCreationBtnACME);
      accCreationBtn.current.addEventListener('mouseleave', accCreationBtnACML);
      signInBtn.current.addEventListener('mouseenter', signInAccCreationME);
      signInBtn.current.addEventListener('mouseleave', signInAccCreationML);
    } else if (!accCreation) {
      accCreationBtn.current.style.background = 'transparent';
      accCreationBtn.current.style.color = '#aaafb1';
      signInBtn.current.style.background = '#3f51b5';
      signInBtn.current.style.color = '#fff';
      accCreationBtn.current.addEventListener(
        'mouseenter',
        accCreationSignInME
      );
      accCreationBtn.current.addEventListener(
        'mouseleave',
        accCreationSignInML
      );
      signInBtn.current.addEventListener('mouseenter', signInSignInME);
      signInBtn.current.addEventListener('mouseleave', signInSignInML);
    }
  }, [accCreation]);
  const signInAccCreationME = () => {
    signInBtn.current.style.background = '#3f51b5';
    signInBtn.current.style.color = '#fff';
  };
  const signInAccCreationML = () => {
    signInBtn.current.style.background = 'transparent';
    signInBtn.current.style.color = '#aaafb1';
  };
  const accCreationBtnACME = () => {
    accCreationBtn.current.style.background = '#546df5';
  };
  const accCreationBtnACML = () => {
    accCreationBtn.current.style.background = '#3f51b5';
    accCreationBtn.current.style.color = '#fff';
  };
  const signInSignInME = () => {
    signInBtn.current.style.background = '#546df5';
    signInBtn.current.style.color = '#fff';
  };
  const signInSignInML = () => {
    signInBtn.current.style.background = '#3f51b5';
    signInBtn.current.style.color = '#fff';
  };
  const accCreationSignInME = () => {
    accCreationBtn.current.style.background = '#3f51b5';
    accCreationBtn.current.style.color = '#fff';
  };
  const accCreationSignInML = () => {
    accCreationBtn.current.style.background = 'transparent';
    accCreationBtn.current.style.color = '#aaafb1';
  };

  const history = useHistory();
  const handleSignIn = () => {
    if (finished) {
      setTimeout(() => {
        setFinished(false);
      }, 200);
    }
    setAccountCreation(false);
    setFirstInput(false);
    const usernameValue = input11.current.value;
    const passwordValue = input21.current.value;
    if (accCreation) {
      input11.current.value = '';
      input11.current.style.borderBottom = '0.1rem solid #ccc';
      input21.current.value = '';
      input21.current.style.borderBottom = '0.1rem solid #ccc';
    }
    i1a.current.style.opacity = '0';
    i1a.current.style.transform = 'translateY(-2rem)';

    if (!accCreation) {
      fetch('https://contenttime-90543.firebaseio.com/auth.json')
        .then((response) => response.json())
        .then((data) => {
          for (let userId in data) {
            console.log(data[userId].password);
            if (
              data[userId].username === usernameValue &&
              data[userId].password === passwordValue
            ) {
              setUser(usernameValue);
              localStorage.setItem('userName', JSON.stringify(usernameValue));
              circle.current.style.transform = 'translateX(-5rem)';
              circle.current.style.opacity = '0';
              triangle.current.style.transform = 'translateX(-5rem)';
              triangle.current.style.opacity = '0';
              square.current.style.transform = 'translateX(-5rem)';
              square.current.style.opacity = '0';
              titleBox.current.style.transform = 'translateY(-5rem)';
              titleBox.current.style.opacity = '0';
              ul1.current.childNodes.forEach(
                (li) => (li.style.transform = 'translateY(17rem)')
              );
              ul2.current.style.display = 'none';
              ul3.current.style.display = 'none';
              form.current.style.transform = 'translateX(30vw)';
              form.current.style.opacity = '0';
              i1a.current.style.display = 'none';
              spinner.current.style.display = 'inline-block';
              setTimeout(() => {
                history.push('/');
              }, 1200);
            } else {
              i1a.current.style.opacity = '1';
              i1a.current.style.transform = 'translateY(0rem)';
              inputHtml.current.textContent =
                'The login attempt was unsuccessful.';
            }
          }
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const createAccountHandler = () => {
    if (!accCreation) {
      if (input11.current.value) {
        input11.current.value = '';
        input11.current.style.borderBottom = '0.1rem solid #d93025';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(0rem)';
      }
      if (input21.current.value) {
        input21.current.value = '';
        setSecondInput(false);
      } else if (!input21.current.value) {
        setSecondInput(false);
      }
    }
    setAccountCreation(true);
    setFirstInput(true);
    if (accCreation) {
      sendToFirebase();
    }
  };

  const sendToFirebase = async () => {
    const usernameValue = input11.current.value;
    let same = false;
    await fetch('https://contenttime-90543.firebaseio.com/auth.json')
      .then((response) => response.json())
      .then((data) => {
        for (let userId in data) {
          console.log(data[userId].password);
          if (data[userId].username === usernameValue) {
            setFinished(true);
            same = true;
            i1a.current.style.opacity = '1';
            i1a.current.style.transform = 'translateY(0rem)';
            inputHtml.current.textContent =
              'This username is taken, attempt was unsuccessful.';
            input11.current.style.borderBottom = '.1rem solid red';
          } else {
            setFinished(false);
          }
        }
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (usernameSafe && passwordSafe && !same) {
      alert(same);
      const data = {
        username: input11.current.value,
        password: input21.current.value,
      };
      fetch('https://contenttime-90543.firebaseio.com/auth.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          response.json();
          i1a.current.style.opacity = 1;
          inputHtml.current.textContent =
            'Your account has been created successfully.';
          setFinished(true);
        })
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const onInputFocus = (e, node) => {
    if (init) {
      setInit(false);
    }
    if (node.current.name === 'username') {
      setSecondInput(false);
      setFirstInput(true);
    } else if (node.current.name === 'password') {
      setSecondInput(true);
      setFirstInput(false);
    }
  };
  const onInputBlur = (node) => {
    node.current.style.color = '#4353a0';
  };

  const checkInput = (e) => {
    if (finished) {
      setFinished(false);
    }
    if (firstInput && accCreation) {
      if (e.length < 3) {
        input11.current.style.borderBottom = '1px solid #d93025';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(0rem)';
        inputHtml.current.textContent =
          'Please enter a username that is at least 3 characters long.';
        setusernameSafe(false);
      } else if (e.length > 16) {
        inputHtml.current.textContent =
          'Please enter a username that is not longer than 16 characters.';
        input11.current.style.borderBottom = '1px solid #d93025';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(0rem)';
        setusernameSafe(false);
      } else {
        input11.current.style.borderBottom = '1px solid lightgreen';
        i1a.current.style.opacity = '0';
        i1a.current.style.transform = 'translateY(-2rem)';
        setusernameSafe(true);
      }
    } else if (secondInput) {
      const number = /[0-9]/;
      const lc = /(.*[a-z].*)/;
      const uc = /(.*[A-Z].*)/;
      let numberBool = false;
      let lcBool = false;
      let ucBool = false;
      if (e.length >= 8) {
        if (number.test(e)) {
          numberBool = true;
        } else if (!number.test(e)) {
          numberBool = false;
        }
        if (lc.test(e)) {
          lcBool = true;
        } else if (!lc.test(e)) {
          lcBool = false;
        }
        if (uc.test(e)) {
          ucBool = true;
        } else if (!uc.test(e)) {
          ucBool = false;
        }
        if (lcBool && ucBool && numberBool) {
          input21.current.style.borderBottom = '1px solid lightgreen';
          i1a.current.style.opacity = '0';
          i1a.current.style.transform = 'translateY(-2rem)';
          setpasswordSafe(true);
        } else {
          inputHtml.current.textContent = `Please enter a password that is at least 8 characters long, containing a minimum of ${
            ucBool ? '' : '1 uppercase,'
          } ${lcBool ? '' : '1 lowercase,'} ${
            numberBool ? '' : '1 numeric character'
          }`;
          i1a.current.style.opacity = '1';
          i1a.current.style.transform = 'translateY(-2rem)';
          input21.current.style.borderBottom = '1px solid #d93025';
          setpasswordSafe(false);
        }
      } else if (!e.length) {
        inputHtml.current.textContent =
          'Please enter a password that is at least 8 characters long, containing a minimum of 1 uppercase, 1 lowercase and 1 numeric character.';
        i1a.current.style.opacity = '1';
        i1a.current.style.transform = 'translateY(-2rem)';
        input21.current.style.borderBottom = '1px solid #d93025';
        setpasswordSafe(false);
      } else if (e.length < 8) {
        if (number.test(e)) {
          numberBool = true;
        } else if (!number.test(e)) {
          console.log(number.test(e));
          numberBool = false;
        }
        if (lc.test(e)) {
          lcBool = true;
        } else if (!lc.test(e)) {
          lcBool = false;
        }
        if (uc.test(e)) {
          ucBool = true;
        } else if (!uc.test(e)) {
          ucBool = false;
        }
        if (lcBool && ucBool && numberBool) {
          inputHtml.current.textContent = `Please enter a password that is at least 8 characters long.`;
          i1a.current.style.opacity = '1';
          i1a.current.style.transform = 'translateY(-2rem)';
          input21.current.style.borderBottom = '1px solid #d93025';
          setpasswordSafe(false);
        } else {
          inputHtml.current.textContent = `Please enter a password that is at least 8 characters long, containing a minimum of ${
            ucBool ? '' : '1 uppercase,'
          } ${lcBool ? '' : '1 lowercase,'} ${
            numberBool ? '' : '1 numeric character'
          }`;
          i1a.current.style.opacity = '1';
          i1a.current.style.transform = 'translateY(-2rem)';
          input21.current.style.borderBottom = '1px solid #d93025';
          setpasswordSafe(false);
        }
      }
    }
  };

  const onChangeHandler = (e) => {
    if (accCreation) {
      checkInput(e);
    }
  };

  return (
    <section id={s.loginBg}>
      <div class={s.ldshourglass} ref={spinner}></div>
      {/* <div class={s.wrapper}>
        <div class={s.circle}></div>
        <div class={s.circle}></div>
        <div class={s.circle}></div>
        <div class={s.shadow}></div>
        <div class={s.shadow}></div>
        <div class={s.shadow}></div>
        <span>Loading</span>
      </div> */}
      <ul id={s.bgLines} ref={ul1}>
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
      <ul id={s.bgLines2} ref={ul2}>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
      </ul>
      <ul id={s.bgLines3} ref={ul3}>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
        <li class={s.bgLine}></li>
      </ul>
      <form ref={form} id={s.form} onSubmit={(e) => e.preventDefault()}>
        <span id={s.fl} />
        <h3>Sign In</h3>
        <label htmlFor="username" id={s.userName} ref={input1}>
          Username
        </label>
        <input
          type="text"
          onChange={() => onChangeHandler(input11.current.value)}
          ref={input11}
          onFocus={(e) => onInputFocus(e, input11)}
          onBlur={() => onInputBlur(input1)}
          name="username"
        />
        <label htmlFor="password" ref={input2}>
          Password
        </label>
        <input
          type="password"
          onChange={() => onChangeHandler(input21.current.value)}
          ref={input21}
          name="password"
          onFocus={(e) => onInputFocus(e, input21)}
          onBlur={() => onInputBlur(input2)}
        />
        <input
          type="Submit"
          readOnly="Sign In"
          onClick={handleSignIn}
          ref={signInBtn}
        />
        <label>-or-</label>
        <button onClick={createAccountHandler} ref={accCreationBtn}>
          Create an Account
        </button>
        <div id={finished ? s.i2a : s.i1a} ref={i1a}>
          <i
            class={
              finished ? 'fas fa-check-square' : 'fas fa-exclamation-circle'
            }
          ></i>
          <span ref={inputHtml}>
            Please enter a username that is at least 3 characters long
          </span>
        </div>
      </form>
      <span id={s.square} ref={square}>
        <span id={s.p1}>
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
          </ul>
        </span>
        <span id={s.p2}>
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
          </ul>
        </span>
        <span id={s.p3}>
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
          </ul>
        </span>
        <span id={s.p4}>
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
          </ul>
        </span>
      </span>
      <span id={s.o} ref={circle}>
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
          <li class={s.oLine}></li>
          <li class={s.oLine}></li>
          <li class={s.oLine}></li>
          <li class={s.oLine}></li>
          <li class={s.oLine}></li>
        </ul>
      </span>
      <span id={s.triangle} ref={triangle}>
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
        </ul>
        <span id={s.triangleHide} />
      </span>
      <div id={s.titleBox} ref={titleBox}>
        <div id={s.logo}>
          <img src={require('../../assets/img/pngwing.com.png')} />
        </div>
        <div id={s.logoTxt}>
          <h1>Content Time</h1>
          <p>People’s Newspaper</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
