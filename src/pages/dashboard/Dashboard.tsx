import styles from "./Dashboard.module.css";
import { useState, useEffect, memo, Fragment } from "react";
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
    selChannelTitle:string;
  }

  function getTVList(){
    tvList.forEach((row)=>{
      row.id=row.title.replace(/\s+/g, "").toLowerCase()
    })
    console.log("TV LIST id uniq ", tvList)
    return tvList
  }

  const [state, setState] = useState<State>({
    tvList:getTVList(),
    favList: [],
    activeUrl: "https://www.youtube.com/embed/YDvsBbKfLPA?si=EJ_oGpcnRTocclvx",
    section: "tvList",
    selChannelId: "1001",
    selChannelFav: false,
    selChannelTitle:'Sky News'
   
  });

  function playVideo(e: React.MouseEventHandler<HTMLDivElement> | any) {
  
    setState((prevState:any) => {
      e.preventDefault();

      const activeUrl = e.target?.dataset.url;
      let selChannelFav = prevState.selChannelFav ? true : false;
      const tempTvList: List[] = structuredClone(prevState).tvList;

      const tempTvListSelected: List | undefined = tempTvList.find((row) => {
        return row.id === e.target.id;
      });
      return {
        ...prevState,
        activeUrl,
        selChannelId: e.target.id,
        selChannelFav,
        selChannelTitle:tempTvListSelected?.title
    
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
  const storedFavList:any=localStorage.getItem("StateFavList");
  const storedFavListObj= JSON.parse(storedFavList);

  if (storedFavListObj?.length>0){
    setState(prevState=>{
      return {
        ...prevState,
        favList:storedFavListObj
      }
    })
  }
  
  },[]);

  useEffect(() => {
    localStorage.setItem("StateFavList", JSON.stringify(state.favList));
    },[state.favList]);

  function TVlist({ list }: { list: string }) {
    let arrList: List[];
    if (list === "tvList" || list === "favList") {
      arrList = state[list];
      console.log("arrList ", arrList)
    }
    else return;

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

    return found?.favorite;


  }

  // function clearAll(){
  //   localStorage.removeItem('State');
  //   localStorage.removeItem('StateFavList');
  //   localStorage.clear();
  //   console.log("LocalStorage ", localStorage)
  // }

  function HeaderPanel() {
    return (
      <>
        <div className={lcdTxt}>
          <div></div>
          <div>{state.selChannelTitle}</div>
          {/* <div><div onClick={clearAll}>Reset</div></div> */}
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

  const Display=memo(function Display() {
    return (
      <>
        <div className={lcd}>
          <ReactPlayer url={state.activeUrl} controls playing={true} />
        </div>
      </>
    );
  })

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
