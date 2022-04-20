import React from "react";
import "./css/About.css";

function About() {
  return (
    <div className="ugossips_about">
      <div className="ugossips_about_child_container">
        <div className="ugossips_about_section_one">
          <div className="ugossips_about_section_one_row_one">
            <img
              className="ugossips_about_img_one"
              src="/img/about1.png"
              alt=""
            />
          </div>
          <div className="ugossips_about_section_one_row_two">
            <h2>Why uGossips exists</h2>
            <p>
              uGossips’s mission is to share and grow the world’s knowledge. Not
              all knowledge can be written down, but much of that which can be,
              still isn't. It remains in people’s heads or only accessible if
              you know the right people. We want to connect the people who have
              knowledge to the people who need it, to bring together people with
              different perspectives so they can understand each other better,
              and to empower everyone to share their knowledge for the benefit
              of the rest of the world.
            </p>
          </div>
        </div>

        <div className="ugossips_about_section_two">
          <div className="ugossips_about_section_two_left">
            <img
              className="ugossips_about_img_two"
              src="/img/about2.png"
              alt=""
            ></img>
          </div>
          <div className="ugossips_about_section_two_right">
            <h2>Gather around a question</h2>
            <p>
              The heart of uGossips is questions — questions that affect the
              world, questions that explain recent world events, questions that
              guide important life decisions, and questions that provide
              insights into why other people think differently. uGossips is a
              place where you can ask questions that matter to you and get
              answers from people who have been there and done that. uGossips is
              where scientists, artists, entrepreneurs, mechanics, and
              homemakers take refuge from misinformation and incendiary
              arguments to share what they know.
            </p>
          </div>
        </div>

        <div className="ugossips_about_section_three">
          <div className="ugossips_about_section_three_left">
            <img
              className="ugossips_about_img_three"
              src="/img/about3.png"
              alt=""
            ></img>
          </div>
          <div className="ugossips_about_section_three_right">
            <h2>Tell a story</h2>
            <p>
              Ever since the first humans gathered around a fire and turned
              their gaze to the stars, humanity has shared knowledge through
              stories. Spaces are digital campfires for collective meaning
              making which expand knowledge sharing from interrogative to
              narrative. In Spaces, creators build audiences of millions for
              their unique insights or audiences of thousands for niche
              knowledge that can't be found anywhere else.
            </p>
          </div>
        </div>

        <div className="ugossips_about_section_four">
          <div className="ugossips_about_section_four_left">
            <img
              className="ugossips_about_img_four"
              src="/img/about4.png"
              alt=""
            ></img>
          </div>
          <div className="ugossips_about_section_four_right">
            <h2>Understand the world and people in it</h2>
            <p>
              Great writers help you understand why the world works the way it
              does, why people behave the way they do, and what we can all do to
              make the world better. Millions of people search the web for
              answers and millions of people write answers on uGossips, every
              week. uGossips’s answers come from people who really understand
              the issues and have first-hand knowledge. uGossips is the place to
              read Barack Obama on the Iran deal, prisoners on life in prison,
              scientists on global warming, police officers on how to deter
              burglars, and TV producers on how their shows are made. uGossips
              is the place to read inspiring people such as Gloria Steinem ,
              Stephen Fry , Hillary Clinton , Glenn Beck , Sheryl Sandberg ,
              Vinod Khosla , and Gillian Anderson directly answering the
              questions people most wanted them to answer. uGossips is where you
              can read important insights that have never been shared anywhere
              else, from people you could never reach any other way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
