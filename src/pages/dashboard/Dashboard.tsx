import { Fragment } from "react/jsx-runtime";
import styles from "./Dashboard.module.css";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { tvList } from "./tvSource";

const Dashboard = () => {
  type List = {
    id: string;
    url: string;
    title: string;
    favorite: boolean;
  };

  interface State {
    tvList: List[];
    favList: List[];
    activeUrl: string;
    section: string;
    selChannelId: string;
    selChannelFav: boolean;
  }

  const [state, setState] = useState<State>({
    tvList,
    favList: [],
    activeUrl: "https://www.youtube.com/embed/YDvsBbKfLPA?si=EJ_oGpcnRTocclvx",
    section: "tvList",
    selChannelId: "1001",
    selChannelFav: false,
   
  });

  function playVideo(e: any) {
    e.preventDefault();

    const activeUrl = e.target.dataset.url;
    let selChannelFav = state.selChannelFav ? true : false;
    setState((prevState) => {
      return {
        ...prevState,
        activeUrl,
        selChannelId: e.target.id,
        selChannelFav,
    
      };
    });
  }

  function addToFavs(e: any) {
    e.stopPropagation();
    const selectedId = state.selChannelId;

    const tempTvList: List[] = structuredClone(state).tvList;

    const tempTvListSelected: List | undefined = tempTvList.find((row) => {
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

  function handleSection(e: React.MouseEvent<HTMLDivElement>) {
    setState((prevState) => {
      const target = e.target as HTMLElement;
      return {
        ...prevState,
        section: target.id,
      };
    });
  }

  useEffect(() => {
    console.log("State ", state);
  });

  function TVlist({ list }: { list: string }) {
    let arrList: List[];

    if (list === "tvList" || list === "favList") {
      arrList = state[list];
    } else return;
    return (
      <>
        <div className={grid}>
          {arrList?.map((row: List) => {
            const { id, url, title, favorite } = row;
            return (
              <Fragment key={id}>
                <div
                  className={`${rokuButton} ${
                    state.selChannelId === id ? selectedTile : ""
                  }`}
                  id={id}
                  data-fav={favorite}
                  data-url={url}
                  onClick={playVideo}
                >
                  <div>
                    <div id={id} data-url={url}>
                      {title}
                    </div>
                    <div id={id} data-url={url} className={favCtnr}>
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

  function isFavorite() {
    const tempTvList: List[] = structuredClone(state).tvList;

    const found=tempTvList.find(row=>{
      return row.id===state.selChannelId
    });

    console.log("### Found ", found?.favorite);

    return found?.favorite;


  }

  function HeaderPanel() {
    return (
      <>
        <div className={lcdTxt}>
          <div></div>
          <div>Watch TV</div>
          <div
            onClick={addToFavs}
            className={favIcon}
            style={{ color: `${isFavorite() ? "red" : "white"}` }}
          >
            ❤
          </div>
        </div>
      </>
    );
  }

  function Display() {
    return (
      <>
        <div className={lcd}>
          <ReactPlayer url={state.activeUrl} controls playing={true} />
        </div>
      </>
    );
  }

  function FavTabPanel() {
    return (
      <>
        <div className={favPanel}>
          <div id="tvList" onClick={handleSection} className={tvTxt}>
            TV Channels
          </div>
          <div className={pipe}></div>
          <div id="favList" onClick={handleSection} className={favTxt}>
            Favorites
          </div>
        </div>
      </>
    );
  }

  function ChannelListing() {
    return (
      <>
        <div className={channelSection}>
          {state.section === "tvList" && <TVlist list="tvList" />}
          {state.section === "favList" && <TVlist list="favList" />}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={main}>
        <div className={intact}>
          <HeaderPanel />
          <Display />
          <FavTabPanel />
        </div>
        <ChannelListing />
      </div>
    </>
  );
};

const {
  rokuButton,
  main,
  lcd,
  lcdTxt,
  grid,
  favPanel,
  channelSection,
  favCtnr,
  selectedTile,
  pipe,
  tvTxt,
  favTxt,
  favIcon,
  intact,
} = styles;

export default Dashboard;
