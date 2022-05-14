import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  detectContentType,
  getImageSize,
} from "next/dist/server/image-optimizer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, FreeMode, Mousewheel } from "swiper";

import config from "../config";
import logo from "../public/img/logo.png";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import alley from "../public/gallery/alley.json";
import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import path from "path";

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
  | "artstation"
  | "pixiv";

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
  title: string;
};

const GALLERY_HEIGHT = 250;

const getSocialIcon = (type: SocialType) => {
  switch (type) {
    case "website":
      return <i className="fa-solid fa-globe"></i>;
    case "email":
      return <i className="fa-solid fa-envelope"></i>;
    case "pixiv":
      return (
        <img
          alt="pixiv logo"
          width={25}
          style={{ position: "relative", top: 2 }}
          src="img/pixiv.svg"
        />
      );
    default:
      return <i className={`fa-brands fa-${type}`}></i>;
  }
};

const GalleryPage: NextPage<Props> = ({
  artists,
  title,
}: {
  artists: Artist[];
  title: string;
}) => {
  return (
    <div>
      <Head>
        <title>Gallery | {title}</title>
        <meta name="description" content="The website for SlugCon 2022!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="header-contents">
          <Link href="/">
            <a className="logo">
              <Image src={logo} alt="SlugCon 2022 logo" />
            </a>
          </Link>

          <h1>
            Artist<br></br>Showcase
          </h1>
          <div className="nav">
            <a href="https://www.twitch.tv/slugcon" className="button">
              Livestream
            </a>
            <Link href="/#schedule">
              <a className="button">Schedule</a>
            </Link>
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
                  {artist.socials?.map((social, j) => (
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
                    mousewheel={{
                      forceToAxis: true,
                    }}
                    scrollbar={{
                      hide: true,
                      draggable: true,
                    }}
                    modules={[Scrollbar, FreeMode, Mousewheel]}
                  >
                    {artist.art?.map((art, j) => (
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
  console.log(`${alley.length} artists`);
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
              socials: artist.socials
                ? artist.socials.sort((a, b) => {
                    if (a.type > b.type) {
                      return 1;
                    } else if (a.type < b.type) {
                      return -1;
                    }
                    return 0;
                  })
                : null,
              art: (
                await Promise.all(
                  art
                    .filter((a) => path.parse(a).base !== "p")
                    .map(async (a) => {
                      const buf = readFileSync(
                        `./public/gallery/${artist.assets}/${a}`
                      );
                      const mime = detectContentType(buf);
                      if (!mime) return null;
                      const type = mime.split("/")[1] as NonNullable<
                        ReturnType<typeof detectContentType>
                      > extends `image/${infer T}`
                        ? T
                        : null;
                      if (type === "svg+xml" || type === "gif") return null;

                      return {
                        path: `/gallery/${artist.assets}/${a}`,
                        ...(await getImageSize(buf, type)),
                      };
                    })
                )
              ).filter((a) => a !== null),
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
      title: config.title,
    },
  };
};

export default GalleryPage;
