import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import logo from "../public/img/logo.png";
import con from "../public/img/2019.jpg";
import config from "../config";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content="The website for SlugCon 2022!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="header-contents">
          <h1>
            <Image src={logo} alt="SlugCon 2022 logo" />
          </h1>
          <h2>
            🕐 May 14th, 1-7PM
            <br />
            📍 C9/Lewis MPR{" "}
          </h2>
          <div className="nav">
            <a href="https://www.twitch.tv/slugcon" className="button">Livestream</a>
            <Link href="/gallery"><a className="button">Artist Showcase</a></Link>
            <a className="button">Schedule</a>
          </div>
        </div>
      </header>

      <main>
        <div className="row">
          <div className="textCol">
            <h2>UCSC&apos;s very own anime and gaming convention!</h2>
            <h3>Admission is free!</h3>
            <p>
              SlugCon is UCSC&apos;s very own anime and gaming convention, hosted by
              SAMA, Slug Gaming, GDA, and College 9.
            </p>
            <p>
              Join us at the College Nine/Lewis MPR on May 14th for our Artists’
              Alley, panels, giveaways, and more!
            </p>
          </div>
          <div className="imgCol home-image">
            <Image src={con} alt="SlugCon 2022" />
          </div>
        </div>
      </main>
    </div>
    
  );
};

export default Home;
