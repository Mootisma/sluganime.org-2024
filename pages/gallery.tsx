import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getImageSize } from "next/dist/server/image-optimizer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, FreeMode } from "swiper";

import config from "../config";
import logo from "../public/img/logo.png";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import alley from "../public/gallery/alley.json";
import { readdir, readFile } from "fs/promises";

type SocialType =
  | "website"
  | "deviantart"
  | "instagram"
  | "email"
  | "youtube"
  | "tumblr"
  | "etsy"
  | "twitch"
  | "twitter"
  | "discord"
  | "tiktok"
  | "artstation";

type Social = {
  type: SocialType;
  url: string;
};

type Artist = {
  icon: string;
  name: string;
  introduction: string;
  socials: Social[];
  assets: string;
  art: {
    path: string;
    width: number;
    height: number;
  }[];
  store?: string;
  commissions?: string;
};

type Props = {
  artists: Artist[];
};

const GALLERY_HEIGHT = 250;

const getSocialIcon = (type: SocialType) => {
  switch (type) {
    case "website":
      return <i className="fa-solid fa-globe"></i>;
    case "email":
      return <i className="fa-solid fa-envelope"></i>;
    default:
      return <i className={`fa-brands fa-${type}`}></i>;
  }
};

const GalleryPage: NextPage<Props> = ({ artists }: { artists: Artist[] }) => {
  return (
    <div>
      <Head>
        <title>Gallery | {config.title}</title>
        <meta name="description" content="The website for SlugCon 2022!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="header-contents">
          <div className="logo">
            <Image src={logo} alt="SlugCon 2022 logo" />
          </div>
          <h1>
            Artist<br></br>Showcase
          </h1>
          <div className="nav">
            <a href="https://www.twitch.tv/slugcon" className="button">
              Livestream
            </a>
            <a className="button" href="#schedule">
              Schedule
            </a>
          </div>
        </div>
      </header>

      <main className="gallery">
        {artists.map((artist, i) => (
          <>
            <div className="row artist" key={i}>
              <div className="textCol">
                <div className="row artist-info">
                  <div className="icon">
                    <Image
                      src={artist.icon}
                      width={64}
                      height={64}
                      alt={artist.name}
                    ></Image>
                  </div>
                  <h2>{artist.name}</h2>
                </div>
                <p>{artist.introduction}</p>
                <div className="row artist-socials">
                  {artist.socials.map((social, j) => (
                    <a
                      target="_blank"
                      href={social.url}
                      className="artist-social"
                      key={j}
                      rel="noreferrer"
                    >
                      {getSocialIcon(social.type)}
                    </a>
                  ))}
                </div>
                <div className="row artist-links">
                  {artist.store !== undefined ? (
                    <a
                      className="button artist-link"
                      target="_blank"
                      rel="noreferrer"
                      href={artist.store}
                    >
                      Store
                    </a>
                  ) : null}
                  {artist.commissions !== undefined ? (
                    <a
                      className="button artist-link"
                      target="_blank"
                      rel="noreferrer"
                      href={artist.commissions}
                    >
                      Commissions
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="imgCol artist-carousel">
                <Gallery>
                  <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={30}
                    freeMode={true}
                    scrollbar={{
                      hide: true,
                      draggable: true,
                    }}
                    modules={[Scrollbar, FreeMode]}
                  >
                    {artist.art.map((art, j) => (
                      <SwiperSlide key={j}>
                        <Item
                          original={art.path}
                          width={art.width}
                          height={art.height}
                        >
                          {({ ref, open }) => (
                            // @ts-ignore
                            <div ref={ref} onClick={open}>
                              <Image
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAGQAQMAAABs65Z3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURe7u7v///yjTqpoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA+SURBVHja7cExAQAAAMKg9U9tDQ8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACASzWd0AABmDxSzAAAAABJRU5ErkJggg=="
                                layout="intrinsic"
                                width={
                                  art.height / art.width > 2 / 3
                                    ? (art.width / art.height) * GALLERY_HEIGHT
                                    : (3 / 2) * GALLERY_HEIGHT
                                }
                                height={GALLERY_HEIGHT}
                                src={art.path}
                                alt="art"
                                objectFit="cover"
                              />
                            </div>
                          )}
                        </Item>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Gallery>
              </div>
            </div>
          </>
        ))}
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      artists: (
        await Promise.all(
          alley.map(async (artist) => {
            let art = await readdir(`./public/gallery/${artist.assets}`);
            if (!art.includes("p.png")) {
              throw `no icon for ${artist.name}`;
            }

            return {
              ...artist,
              art: await Promise.all(
                art
                  .filter((a) => a !== "p.png" && a.toLowerCase().endsWith(".png"))
                  .map(async (a) => ({
                    path: `/gallery/${artist.assets}/${a}`,
                    ...(await getImageSize(
                      await readFile(`./public/gallery/${artist.assets}/${a}`),
                      "png"
                    )),
                  }))
              ),
              icon: `/gallery/${artist.assets}/p.png`,
            };
          })
        )
      ).sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
        return 0;
      }),
    },
  };
};

export default GalleryPage;
