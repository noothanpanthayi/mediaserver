import { Fragment } from "react/jsx-runtime";
import styles from "./Dashboard.module.css";
import { tvList } from "./tvSource";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

const Dashboard = () => {
  const [state, setState] = useState({
    tvList,
    favList: [],
    activeUrl: "https://www.youtube.com/embed/YDvsBbKfLPA?si=EJ_oGpcnRTocclvx",
    section: "tvList",
    selChannelId: "1003",
  });

  const videoRef = useRef(null);

  function playVideo(e: any) {
    e.preventDefault();

    const activeUrl = e.target.dataset.url;

    setState((prevState) => {
      return {
        ...prevState,
        activeUrl,
        selChannelId:e.target.id
      };
    });
  }

  function addToFavs(e: any) {
    e.stopPropagation();
    const selectedId = e.target.id;

    const tempTvList = structuredClone(state).tvList;

    const tempTvListSelected = tempTvList.find((row) => {
      return row.id === selectedId;
    });

    if (tempTvListSelected)
      tempTvListSelected.favorite = !tempTvListSelected?.favorite;

    let favList = [];
    setState((prevState) => {
      if (tempTvListSelected?.favorite) {
        favList = [...prevState.favList, tempTvListSelected];
      } else {
        favList = prevState.favList.filter((item) => item?.id !== selectedId);
      }

      return {
        ...prevState,
        favList,
        tvList: tempTvList,
      };
    });
  }

  function handleSection(e: any) {
    setState((prevState) => {
      return {
        ...prevState,
        section: e.target.id,
      };
    });
  }

  useEffect(() => {
    console.log("State ", state);
  });

  function TVlist({ list }) {
    return (
      <>
        <div className={grid}>
          {state[list].map(({ id, url, title, favorite }) => {
            return (
              <Fragment key={id}>
                <div
                  className={`${rokuButton} ${state.selChannelId===id?selectedTile:''}`}
                  id={id}
                  data-url={url}
                  onClick={playVideo}
                >
                  <div>
                    <div id={id} data-url={url}>{title}</div>
                    <div  id={id} data-url={url} className={favCtnr}>
                      <div
                        id={id}
                        onClick={addToFavs}
                        className={favSize}
                        style={{ color: `${favorite ? "red" : "white"}` }}
                      >
                        ❤
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className={main}>
      <div className={lcdTxt}>Watch TV</div>
      <div className={lcd}>
        <ReactPlayer url={state.activeUrl} controls playing={true} />
      </div>
      <div className={content}>
        <div></div>
        <div className={favPanel}>
          <div id="tvList" onClick={handleSection} className={tvTxt}>
            TV Channels
          </div>
          <div className={pipe}></div>
          <div id="favList" onClick={handleSection} className={favTxt}>
            Favorites
          </div>
        </div>
        {state.section === "tvList" && <TVlist list="tvList" />}
        {state.section === "favList" && <TVlist list="favList" />}
      </div>
    </div>
  );
};

const {
  rokuButton,
  main,
  lcd,
  lcdTxt,
  grid,
  favPanel,
  content,
  channel,
  favSize,
  favCtnr,
  selectedTile,
  pipe,
  tvTxt,
  favTxt
} = styles;

export default Dashboard;
