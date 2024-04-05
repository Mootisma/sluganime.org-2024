import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import logo from "../public/img/logo.png";
import con from "../public/img/2019.jpg";
import config from "../config";
import itinerary from "../public/itinerary.json";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content="The website for SlugCon 2023!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="header-contents">
          <h1>
            <Image src={logo} alt="SlugCon 2023 logo" />
          </h1>
          <h2>
            🕐 May 19th, 1-7PM
            <br />
            📍 Merrill Cultural Center{" "}
          </h2>
          <div className="nav">
            <a href="https://www.twitch.tv/slugcon" className="button">
              Livestream
            </a>
            <Link href="/gallery">
              <a className="button">Artist Showcase</a>
            </Link>
            <a className="button" href="#schedule">
              Schedule
            </a>
          </div>
        </div>
      </header>

      <main className="home">
        <div className="section">
          <div className="row">
            <div className="textCol">
              <h2>UCSC&apos;s very own anime and gaming convention!</h2>
              <h3>Admission is free!</h3>
              <p>
                SlugCon is UCSC&apos;s very own anime convention,
				hosted by SAMA!
              </p>
              <p>
              Join us at the Merrill Cultural Center on May 19th for our Artists’ Alley, Maid Cafe, panels, giveaways, and more!
              </p>
                <a className="button block" href="/discord">
                  Join the Discord!
                </a>
            </div>
            <div className="imgCol home-image">
              <Image src={con} alt="SlugCon 2024" />
            </div>
          </div>
        </div>

        <div className="section" id="schedule">
          <h2>Schedule</h2>
          {itinerary.map((event) => (
            <>
              {" "}
              <div className="row">
                <div className="time">
                  <h3>{event.time}</h3>
                </div>
                <div className="event">
                  <h3>{event.title}</h3>
                  {event.subtitle !== undefined ? (
                    <h4>{event.subtitle}</h4>
                  ) : null}
                </div>
              </div>
              <hr></hr>
            </>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
