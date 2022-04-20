import React from "react";
import "./css/Terms.css";

function Terms() {
  return (
    <div className="ugossips_terms">
      <div className="ugossips_terms_child_container">
        <div className="ugossips_terms_header">
          <h3>Terms of Service</h3>
          <hr />
        </div>
        <div className="ugossips_terms_content">
          <p>
            <b>
              An Introduction to uGossips’s Terms of Service Welcome to
              uGossips!
            </b>
            <br />
            Here is a quick summary of the highlights of our Terms of Service:
          </p>
          <ul>
            <li>
              <i>
                <b>Our mission is to share and grow the world’s knowledge</b>
              </i>
              . The uGossips platform offers a place to ask questions and
              connect with people who contribute unique insights and quality
              answers. This empowers people to learn from each other and to
              better understand the world.
            </li>
            <li>
              <i>
                <b>You own the content that you post;</b>
              </i>{" "}
              you also grant us and other users of the uGossips platform certain
              rights and license to use it.
            </li>
            <li>
              <i>
                <b>You are responsible for the content that you post.</b>
              </i>{" "}
              This includes ensuring that you have the rights needed for you to
              post that content and that your content does not violate the legal
              rights of another party or any applicable laws.
            </li>
            <li>
              <i>
                <b>
                  You can repost a small portion of any answer or post posted on
                  uGossips elsewhere,{" "}
                </b>
              </i>
              provided that you attribute such content back to the uGossips
              platform and respect the rights of the original poster, including
              any “not for reproduction” designation, and do not use automated
              tools.
            </li>
            <li>
              <i>
                <b>We do not endorse or verify content posted by users.</b>
              </i>{" "}
              Our content and materials are provided to you “as is,” without any
              guarantees. You are solely responsible for your own use of the
              uGossips platform. Posts from lawyers, doctors, and other
              professionals should not be treated as a substitute for
              professional advice for your specific situation.
            </li>
            <li>
              <i>
                <b>You agree to follow the rules of our platform.</b>
              </i>{" "}
              When you use the uGossips platform, you also agree to our Terms of
              Service, accept our Privacy Policy, and agree to follow our
              Acceptable Use Policy, Copyright Policy, and Trademark Policy.
            </li>
            <li>
              <i>
                <b>
                  We offer tools for you to give feedback and report complaints.
                </b>
              </i>{" "}
              If you think someone has violated your intellectual property
              rights, other laws, or uGossips's policies, you can initiate a
              report at the contact us portal or by using our in-product
              reporting tool.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Terms;
