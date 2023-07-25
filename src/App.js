import "./App.css";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import React, { useEffect, useRef, useState } from "react";
import List from "./components/List";
import { getLocalList, updateLocalList } from "./service/updateLocal";
function App() {
  const [qr, setQr] = useState("");
  const [val, setVal] = useState("");
  const [list, setList] = useState(getLocalList());
  const [clip, setClip] = useState(null);
  let ref = useRef(null);

  useEffect(() => {
    if (!list.includes(clip) && clip) {
      setList(prev => [...prev, clip]);
    }
  }, [clip]);

  const readFromClip = () => {
    if (document.hidden) {
    } else {
      navigator.clipboard
        .readText()
        .then(text => {
          console.log(text);
          setClip(text);
        })
        .catch(err => {
          alert("Dasturni ishlatishdan oldin uning biron joyini bosing!");
          console.error("Failed to read clipboard contents: ", err);
        });
    }
  };

  useEffect(() => {
    if (list?.length > 0) {
      updateLocalList(list);
    }
  }, [list]);

  useEffect(() => {
    document.addEventListener("visibilitychange", readFromClip);
    return () => {
      document.removeEventListener("visibilitychange", readFromClip);
    };
  }, []);

  console.log(list);

  useEffect(() => {
    if (val.length === 17) {
      setQr(val);
      navigator.vibrate(200);
    }
  }, [val]);

  const handlePlus = () => {
    if (val && list.includes(val)) {
      const index = list.indexOf(val);
      if (index > -1) {
        setVal(list[index + 1] || "");
        setList(prev => prev.filter((_, i) => i != index));
      }
    } else {
      setVal(list[0] || "");
    }
  };

  const [touchStart, setTouchStart] = useState();
  const [touchEnd, setTouchEnd] = useState();

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = e => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) {
      const incrementedVal = Number(val) - 1;
      setVal(incrementedVal.toString());
    }

    if (isLeftSwipe) {
      const incrementedVal = Number(val) + 1;
      setVal(incrementedVal.toString());
    }
  };
  return (
    <div className="App">
      <List list={list}></List>
      <div>
        <div
          style={{
            background: "white",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <motion.div whileTap={{ scale: 1.1 }}>
            <QRCode
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={handlePlus}
              size={200}
              value={qr}
            />
          </motion.div>
        </div>
        <div className="input-area">
          <input
            ref={ref}
            onChange={e => {
              if (e.target.value.length < 18) {
                setVal(e.target.value);
              }
            }}
            value={val}
            type="tel"
            className="input"
            style={{ outlineColor: val.length === 17 ? "#329932" : "#FF5252" }}
            placeholder="number..."
          ></input>
        </div>
      </div>
    </div>
  );
}
export default App;
